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
import Customer from '../models/Customer';
import CustomerLite from '../models/CustomerLite';
import IAction from './IAction';

interface CustomerListState {
    isLoading: boolean;
    customers: CustomerLite[];
}

const DEFAULT_CUSTOMER_LIST_STATE: CustomerListState = {
    isLoading: false,
    customers: [],
};

interface SingleCustomerState {
    isLoading: boolean;
    customer: Customer | null;
}

const DEFAULT_SINGLE_CUSTOMER_STATE: SingleCustomerState = {
    isLoading: false,
    customer: null,
};

export interface CustomerStoreState {
    list: CustomerListState;
    details: SingleCustomerState;
}

interface RequestCustomersAction extends IAction {
    type: ActionType.REQUEST_CUSTOMERS;
}

interface ReceiveCustomersAction extends IAction {
    type: ActionType.RECEIVE_CUSTOMERS;
    customers: CustomerLite[];
}

interface RequestCustomerDetailsAction extends IAction {
    type: ActionType.REQUEST_CUSTOMER_DETAILS;
}

interface ReceiveCustomerDetailsAction extends IAction {
    type: ActionType.RECEIVE_CUSTOMER_DETAILS;
    customer: Customer;
}

interface ResetCustomerDetailsAction {
    type: ActionType.RESET_CUSTOMER_DETAILS;
}

interface ResetCustomersListAction {
    type: ActionType.RESET_CUSTOMERS_LIST;
}

interface ResetCustomerStoreAction {
    type: ActionType.RESET_CUSTOMER_STORE_STATE;
}

type KnownAction = RequestCustomersAction |
    ReceiveCustomersAction |
    RequestCustomerDetailsAction |
    ReceiveCustomerDetailsAction |
    ResetCustomerDetailsAction |
    ResetCustomersListAction |
    ResetCustomerStoreAction;

const logger = new Logger('Customer Store');

export const actionCreators = {
    requestCustomers: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.customers) &&
            !appState.customers.list.isLoading &&
            (isEmpty(appState.customers.list.customers))) {

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

    requestCustomerDetails: (customerNumber: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.customers) &&
            !appState.customers.details.isLoading &&
            (isNil(appState.customers.details.customer) ||
                appState.customers.details.customer.customerNumber !== customerNumber)) {
            const tenantId = appState.tenants?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Customers.');
                return;
            }

            const accessToken = await authService.getAccessToken();

            fetch(`api/sales/${tenantId}/customer/${customerNumber}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<Customer>
                })
                .then((customer) => {
                    if (!isNil(customer)) {
                        dispatch({
                            type: ActionType.RECEIVE_CUSTOMER_DETAILS,
                            customer,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_CUSTOMER_DETAILS });
        }
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_CUSTOMER_STORE_STATE });
    },

    resetCustomerDetails: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_CUSTOMER_DETAILS });
    },

    resetCustomersList: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_CUSTOMERS_LIST });
    },
}

const unloadedState: CustomerStoreState = {
    list: { ...DEFAULT_CUSTOMER_LIST_STATE },
    details: { ...DEFAULT_SINGLE_CUSTOMER_STATE },
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
                    list: {
                        ...state.list as Pick<CustomerListState, keyof CustomerListState>,
                        isLoading: true,
                    },
                };

            case ActionType.RECEIVE_CUSTOMERS:
                return {
                    ...state,
                    list: {
                        ...state.list as Pick<CustomerListState, keyof CustomerListState>,
                        isLoading: false,
                        customers: action.customers,
                    },
                };

            case ActionType.REQUEST_CUSTOMER_DETAILS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleCustomerState, keyof SingleCustomerState>,
                        isLoading: true,
                    },
                };

            case ActionType.RECEIVE_CUSTOMER_DETAILS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleCustomerState, keyof SingleCustomerState>,
                        isLoading: false,
                        customer: action.customer,
                    },
                };

            case ActionType.RESET_CUSTOMERS_LIST:
                return {
                    ...state,
                    list: { ...DEFAULT_CUSTOMER_LIST_STATE },
                };

            case ActionType.RESET_CUSTOMER_DETAILS:
                return {
                    ...state,
                    details: { ...DEFAULT_SINGLE_CUSTOMER_STATE },
                };

            case ActionType.RESET_CUSTOMER_STORE_STATE:
                return unloadedState;
        }
    }

    return state;
};
