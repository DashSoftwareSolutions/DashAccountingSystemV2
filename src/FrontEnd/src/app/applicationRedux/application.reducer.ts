import { isNil } from 'lodash';
import { Action, Reducer } from 'redux';
import ActionType from '../globalReduxStore/actionType';
import { KnownAction } from './application.actions';
import {
    BootstrapInfo,
    NavigationSection,
    Tenant,
} from '../../common/models';

/**
 * State for the Application Redux "slice"
 */
export interface ApplicationState extends BootstrapInfo {
    isFetchingBootstrap: boolean;
    isFetchingVersion: boolean;
    selectedNavigationSection: NavigationSection | null;
    selectedTenant: Tenant | null,
}

const unloadedState: ApplicationState = {
    isFetchingBootstrap: false,
    isFetchingVersion: false,
    applicationVersion: '',
    selectedNavigationSection: null,
    selectedTenant: null,
    tenants: [],
    userInfo: {
        id: '',
        firstName: '',
        lastName: ''
    },
};

const reducer: Reducer<ApplicationState> = (state: ApplicationState | undefined, incomingAction: Action): ApplicationState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_APPLICATION_VERSION:
                return {
                    ...state,
                    isFetchingVersion: true,
                };

            case ActionType.RECEIVE_APPLICATION_VERSION:
                return {
                    ...state,
                    applicationVersion: action.applicationVersion,
                    isFetchingVersion: false,
                };

            case ActionType.REQUEST_BOOTSTRAP_INFO:
                return {
                    ...state,
                    isFetchingBootstrap: true,
                };

            case ActionType.RECEIVE_BOOTSTRAP_INFO:
                return {
                    ...state,
                    ...action.bootstrapInfo,
                    isFetchingBootstrap: false,
                };

            case ActionType.SELECT_TENANT:
                return {
                    ...state,
                    selectedTenant: action.tenant,
                };

            case ActionType.SET_NAVIGATION_SECTION: {
                return {
                    ...state,
                    selectedNavigationSection: action.navigationSection,
                };
            }
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
