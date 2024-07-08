import { isNil } from 'lodash';
import { Action, Reducer } from 'redux';
import ActionType from '../store/actionType';
import { KnownAction } from './bootstrap.actions';
import {
    BootstrapInfo,
    Tenant,
} from '../../common/models';

/**
 * State for the Bootstrap Redux "slice"
 */
export interface BootstrapState extends BootstrapInfo {
    isFetching: boolean;
    isFetchingVersion: boolean;
    selectedTenant: Tenant | null,
}

const unloadedState: BootstrapState = {
    isFetching: false,
    isFetchingVersion: false,
    applicationVersion: '',
    selectedTenant: null,
    tenants: [],
    userInfo: {
        id: '',
        firstName: '',
        lastName: ''
    },
};

const reducer: Reducer<BootstrapState> = (state: BootstrapState | undefined, incomingAction: Action): BootstrapState => {
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
                    isFetching: true,
                };

            case ActionType.RECEIVE_BOOTSTRAP_INFO:
                return {
                    ...state,
                    ...action.bootstrapInfo,
                    isFetching: false,
                };

            case ActionType.SELECT_TENANT:
                return {
                    ...state,
                    selectedTenant: action.tenant,
                };
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
