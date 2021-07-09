import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import IAction from './IAction';
import Tenant from '../models/Tenant';

export interface TenantsState {
    isLoading: boolean;
    tenants: Tenant[];
    selectedTenant: Tenant | null,
}

interface RequestTenantsAction extends IAction {
    type: ActionType.REQUEST_TENANTS;
}

interface ReceiveTenantsAction extends IAction {
    type: ActionType.RECEIVE_TENANTS;
    tenants: Tenant[];
}

interface SelectTenantAction extends IAction {
    type: ActionType.SELECT_TENANT;
    tenant: Tenant;
}

type KnownAction = RequestTenantsAction | ReceiveTenantsAction | SelectTenantAction;

export const actionCreators = {
    requestTenants: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.tenants) &&
            !appState.tenants.isLoading &&
            isEmpty(appState.tenants.tenants)) {
            const accessToken = await authService.getAccessToken();

            fetch('api/tenants', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<Tenant[]>;
                })
                .then((tenants) => {
                    if (!isNil(tenants)) {
                        dispatch({ type: ActionType.RECEIVE_TENANTS, tenants });

                        if (!isEmpty(tenants) && tenants.length === 1) {
                            dispatch({ type: ActionType.SELECT_TENANT, tenant: tenants[0] });
                        }
                    }
                });

            dispatch({ type: ActionType.REQUEST_TENANTS });
        }
    },

    selectTenant: (tenant: Tenant): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.SELECT_TENANT, tenant });
    }
};

const unloadedState: TenantsState = { isLoading: false, selectedTenant: null, tenants: [] };

export const reducer: Reducer<TenantsState> = (state: TenantsState | undefined, incomingAction: Action): TenantsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_TENANTS:
                return {
                    ...state,
                    isLoading: true
                };

            case ActionType.RECEIVE_TENANTS:
                return {
                    ...state,
                    tenants: action.tenants,
                    isLoading: false
                };

            case ActionType.SELECT_TENANT:
                return {
                    ...state,
                    selectedTenant: action.tenant,
                };
        }
    }

    return state;
}