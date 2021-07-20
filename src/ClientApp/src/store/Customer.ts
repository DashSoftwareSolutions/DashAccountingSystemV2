import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import CustomerLite from '../models/CustomerLite';
import IAction from './IAction';

export interface CustomerStoreState {
    isLoading: boolean;
    customers: CustomerLite[];
}

interface RequestCustomersAction extends IAction {
    type: ActionType.REQUEST_CUSTOMERS;
}

interface ReceiveCustomersAction extends IAction {
    type: ActionType.RECEIVE_CUSTOMERS;
    customers: CustomerLite[];
}

type KnownAction = RequestCustomersAction | ReceiveCustomersAction;

const logger = new Logger('Customer Store');

export const actionCreators = {
    requestCustomers: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.customers) &&
            !appState.customers.isLoading &&
            (isEmpty(appState.customers.customers))) {

            const tenantId = appState.tenants?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Customers.');
                return;
            }

            const accessToken = await authService.getAccessToken();

            fetch(`api/sales/${tenantId}/customers`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<CustomerLite[]>
                })
                .then(customers => {
                    if (!isNil(customers)) {
                        dispatch({
                            type: ActionType.RECEIVE_CUSTOMERS,
                            customers,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_CUSTOMERS });
        }
    },
}

const unloadedState: CustomerStoreState = {
    isLoading: false,
    customers: [],
};

export const reducer: Reducer<CustomerStoreState> = (state: CustomerStoreState | undefined, incomingAction: Action): CustomerStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_CUSTOMERS:
                return {
                    ...state,
                    isLoading: true
                };

            case ActionType.RECEIVE_CUSTOMERS:
                return {
                    ...state,
                    isLoading: false,
                    customers: action.customers,
                };
        }
    }

    return state;
};
