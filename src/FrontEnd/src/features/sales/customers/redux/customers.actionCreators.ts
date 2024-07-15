import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './customers.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    ILogger,
    Logger,
} from '../../../../common/logging';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import {
    Customer,
    CustomerLite
} from '../models';

const logger: ILogger = new Logger('Customer Actions');

const actionCreators = {
    requestCustomers: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.customers) &&
            !appState.customers.list.isFetching &&
            (isEmpty(appState.customers.list.customers))) {

            const tenantId = appState.application?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Customers.');
                return;
            }

            const accessToken = appState.authentication.tokens?.accessToken;

            fetch(`/api/sales/${tenantId}/customers`, {
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
            !appState.customers.details.isFetching &&
            (isNil(appState.customers.details.customer) ||
                appState.customers.details.customer.customerNumber !== customerNumber)) {
            const tenantId = appState.application?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Customer details.');
                return;
            }

            const accessToken = appState.authentication.tokens?.accessToken;

            fetch(`/api/sales/${tenantId}/customer/${customerNumber}`, {
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
};

export default actionCreators;
