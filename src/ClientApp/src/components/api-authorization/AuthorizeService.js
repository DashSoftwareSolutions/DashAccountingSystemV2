import {
    Log as OidcClientLogging,
    UserManager,
    WebStorageStateStore,
} from 'oidc-client';
import { getMutex } from 'simple-mutex-promise';
import {
    ApplicationPaths,
    ApplicationName,
} from './ApiAuthorizationConstants';
import { Logger } from '../../common/Logging';

export class AuthorizeService {
    _callbacks = [];
    _nextSubscriptionId = 0;

    _user = null;
    _isAuthenticated = false;
    _isInitializingUserManager = false;
    _userManagerInitializationMutex = getMutex();

    _logger = new Logger('Authorize Service');

    // By default pop ups are disabled because they don't work properly on Edge.
    // If you want to enable pop up authentication simply set this flag to false.
    _popUpDisabled = true;

    async isAuthenticated() {
        const user = await this.getUser();
        return !!user;
    }

    async getUser() {
        if (this._user && this._user.profile) {
            return this._user.profile;
        }

        await this.ensureUserManagerInitialized();
        const user = await this.userManager.getUser();
        return user && user.profile;
    }

    async getAccessToken() {
        await this.ensureUserManagerInitialized();
        const user = await this.userManager.getUser();
        return user && user.access_token;
    }

    // We try to authenticate the user in three different ways:
    // 1) We try to see if we can authenticate the user silently. This happens
    //    when the user is already logged in on the IdP and is done using a hidden iframe
    //    on the client.
    // 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
    //    Pop-Up blocker or the user has disabled PopUps.
    // 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
    //    redirect flow.
    async signIn(state) {
        await this.ensureUserManagerInitialized();

        try {
            const silentUser = await this.userManager.signinSilent(this.createArguments());
            this.updateState(silentUser);
            return this.success(state);
        } catch (silentError) {
            // User might not be authenticated, fallback to popup authentication
            this._logger.info("Silent authentication error: ", silentError);

            try {
                if (this._popUpDisabled) {
                    throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
                }

                const popUpUser = await this.userManager.signinPopup(this.createArguments());
                this.updateState(popUpUser);
                return this.success(state);
            } catch (popUpError) {
                if (popUpError.message === "Popup window closed") {
                    // The user explicitly cancelled the login action by closing an opened popup.
                    return this.error("The user closed the window.");
                } else if (!this._popUpDisabled) {
                    this._logger.info("Popup authentication error: ", popUpError);
                }

                // PopUps might be blocked by the user, fallback to redirect
                try {
                    await this.userManager.signinRedirect(this.createArguments(state));
                    return this.redirect();
                } catch (redirectError) {
                    this._logger.info("Redirect authentication error: ", redirectError);
                    return this.error(redirectError);
                }
            }
        }
    }

    async completeSignIn(url) {
        try {
            await this.ensureUserManagerInitialized();
            const user = await this.userManager.signinCallback(url);
            this.updateState(user);
            return this.success(user && user.state);
        } catch (error) {
            this._logger.info('There was an error signing in: ', error);
            return this.error('There was an error signing in.');
        }
    }

    // We try to sign out the user in two different ways:
    // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
    //    Pop-Up blocker or the user has disabled PopUps.
    // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
    //    post logout redirect flow.
    async signOut(state) {
        await this.ensureUserManagerInitialized();

        try {
            if (this._popUpDisabled) {
                throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
            }

            await this.userManager.signoutPopup(this.createArguments());
            this.updateState(undefined);
            return this.success(state);
        } catch (popupSignOutError) {
            this._logger.info("Popup signout error: ", popupSignOutError);

            try {
                await this.userManager.signoutRedirect(this.createArguments(state));
                return this.redirect();
            } catch (redirectSignOutError) {
                this._logger.info("Redirect signout error: ", redirectSignOutError);
                return this.error(redirectSignOutError);
            }
        }
    }

    async completeSignOut(url) {
        await this.ensureUserManagerInitialized();

        try {
            const response = await this.userManager.signoutCallback(url);
            this.updateState(null);
            return this.success(response && response.data);
        } catch (error) {
            this._logger.info(`There was an error trying to log out '${error}'.`);
            return this.error(error);
        }
    }

    updateState(user) {
        this._user = user;
        this._isAuthenticated = !!this._user;
        this.notifySubscribers();
    }

    subscribe(callback) {
        this._callbacks.push({ callback, subscription: this._nextSubscriptionId++ });
        return this._nextSubscriptionId - 1;
    }

    unsubscribe(subscriptionId) {
        const subscriptionIndex = this._callbacks
            .map((element, index) => element.subscription === subscriptionId ? { found: true, index } : { found: false })
            .filter(element => element.found === true);

        if (subscriptionIndex.length !== 1) {
            throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
        }

        this._callbacks.splice(subscriptionIndex[0].index, 1);
    }

    notifySubscribers() {
        for (let i = 0; i < this._callbacks.length; i++) {
            const callback = this._callbacks[i].callback;
            callback();
        }
    }

    createArguments(state) {
        return { useReplaceToNavigate: true, data: state };
    }

    error(message) {
        return { status: AuthenticationResultStatus.Fail, message };
    }

    success(state) {
        return { status: AuthenticationResultStatus.Success, state };
    }

    redirect() {
        return { status: AuthenticationResultStatus.Redirect };
    }

    async ensureUserManagerInitialized() {
        this._logger.debug('ensureUserManagerInitialized() was called...');

        const [lock, release] = this._userManagerInitializationMutex.getLock();

        if (!this._isInitializingUserManager) {
            if (this.userManager !== undefined) {
                this._logger.debug('User Manager is already initialized.');
                return;
            }

            this._logger.debug('Acquiring sync lock...');
            await lock;

            if (!this._isInitializingUserManager) {
                this._isInitializingUserManager = true;

                if (this.userManager !== undefined) {
                    this._logger.debug('User Manager is already initialized.  Releasing sync lock...');
                    this._isInitializingUserManager = false;
                    release();
                    return;
                }

                this._logger.debug('Starting User Manager initialization...');
                await this.initializeUserManager();

                this._logger.debug('User Manager initialization complete.  Releasing sync lock...');
                this._isInitializingUserManager = false;
                release();
            }
        }
    }

    async initializeUserManager() {
        const response = await fetch(ApplicationPaths.ApiAuthorizationClientConfigurationUrl);

        if (!response.ok) {
            throw new Error(`Could not load settings for '${ApplicationName}'`);
        }

        let settings = await response.json();
        settings.automaticSilentRenew = true;
        settings.includeIdTokenInSilentRenew = true;

        settings.userStore = new WebStorageStateStore({
            prefix: ApplicationName
        });

        OidcClientLogging.logger = new Logger('OIDC Client'); // Tell OIDC Client library to use our structured logger
        // OidcClientLogging.level = OidcClientLogging.DEBUG; // Uncomment this if we need more verbose logging from OIDC Client library

        this.userManager = new UserManager(settings);

        this.userManager.events.addAccessTokenExpired(() => {
            this._logger.info('UserManager: Access token has expired');
        });

        this.userManager.events.addAccessTokenExpiring(() => {
            this._logger.info('UserManager: Access token about to expire');
        });

        this.userManager.events.addSilentRenewError((error) => {
            this._logger.error('UserManager: Silent Renew Error: ', error);
        });

        this.userManager.events.addUserLoaded((user) => {
            this._logger.info('UserManager: User loaded');
            this.updateState(user);
        });

        this.userManager.events.addUserSessionChanged(() => {
            this._logger.info('UserManager: User session changed');
        });

        this.userManager.events.addUserSignedOut(async () => {
            this._logger.info('UserManager: User signed out');
            await this.userManager.removeUser();
            this.updateState(undefined);
        });

        this.userManager.events.addUserUnloaded(() => {
            this._logger.info('UserManager: User unloaded');
        });
    }

    static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;

export const AuthenticationResultStatus = {
    Redirect: 'redirect',
    Success: 'success',
    Fail: 'fail'
};
