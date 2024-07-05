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
    selectedTenant: Tenant | null,
}

const unloadedState: BootstrapState = {
    isFetching: false,
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

    return state;
};

export default reducer;
