import { isNil } from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import ActionType from '../../store/actionType';
import { KnownAction } from './authentication.actions';
import { AccessTokenResponse } from '../models';

export interface AuthenticationState {
    hasLoginError: boolean;
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    isLoggingOut: boolean;
    tokens: AccessTokenResponse | null;
}

const unloadedState: AuthenticationState = {
    hasLoginError: false,
    isLoggedIn: false,
    isLoggingIn: false,
    isLoggingOut: false,
    tokens: null,
};

const reducer: Reducer<AuthenticationState> = (state: AuthenticationState | undefined, incomingAction: Action): AuthenticationState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_LOGIN:
                return {
                    ...state,
                    hasLoginError: false,
                    isLoggingIn: true,
                };

            case ActionType.RECEIVE_SUCCESSFUL_LOGIN_RESPONSE:
                return {
                    ...state,
                    isLoggedIn: true,
                    isLoggingIn: false,
                    tokens: action.accessTokenResponse,
                };

            case ActionType.RECEIVE_FAILED_LOGIN_RESPONSE:
                return {
                    ...state,
                    hasLoginError: true,
                    isLoggingIn: false,
                };

            case ActionType.SET_EXISTING_TOKENS_FROM_SESSION_STORAGE:
                return {
                    ...state,
                    isLoggedIn: true,
                    tokens: action.tokens,
                };

            case ActionType.REQUEST_LOGOUT:
                return {
                    ...state,
                    isLoggingOut: true,
                };

            case ActionType.RECEIVE_LOGOUT_RESPONSE:
                return {
                    ...state,
                    isLoggedIn: false,
                    isLoggingOut: false,
                    tokens: null,
                };
        }
    }

    return state;
};

export default reducer;
