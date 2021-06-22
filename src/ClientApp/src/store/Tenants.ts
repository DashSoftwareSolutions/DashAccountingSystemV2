import { Action, Reducer } from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import authService from '../components/api-authorization/AuthorizeService';
import Tenant from '../models/Tenant';

export interface TenantsState {
    isLoading: boolean;
    tenants: Tenant[];
    selectedTenant: Tenant | null,
}

interface RequestTenantsAction {
    type: 'REQUEST_TENANTS';
}

interface ReceiveTenantsAction {
    type: 'RECEIVE_TENANTS';
    tenants: Tenant[];
}

interface SelectTenantAction {
    type: 'SELECT_TENANT';
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

            fetch('api/tenant', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json() as Promise<Tenant[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TENANTS', tenants: data });

                    if (!isEmpty(data) && data.length === 1) {
                        const tenant = data[0];
                        dispatch({ type: 'SELECT_TENANT', tenant });
                    }
                });

            dispatch({ type: 'REQUEST_TENANTS' });
        }
    },

    selectTenant: (tenant: Tenant): AppThunkAction<KnownAction> => (dispatch) => {
        console.log('Selected a Tenant:', tenant);
        dispatch({ type: 'SELECT_TENANT', tenant });
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
            case 'REQUEST_TENANTS':
                return {
                    ...state,
                    isLoading: true
                };

            case 'RECEIVE_TENANTS':
                return {
                    ...state,
                    tenants: action.tenants,
                    isLoading: false
                };

            case 'SELECT_TENANT':
                return {
                    ...state,
                    selectedTenant: action.tenant,
                };
        }
    }

    return state;
}