import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    Customer,
    CustomerLite,
} from '../models';

export interface RequestCustomersAction extends IAction {
    type: ActionType.REQUEST_CUSTOMERS;
}

export interface ReceiveCustomersAction extends IAction {
    type: ActionType.RECEIVE_CUSTOMERS;
    customers: CustomerLite[];
}

export interface RequestCustomerDetailsAction extends IAction {
    type: ActionType.REQUEST_CUSTOMER_DETAILS;
}

export interface ReceiveCustomerDetailsAction extends IAction {
    type: ActionType.RECEIVE_CUSTOMER_DETAILS;
    customer: Customer;
}

export interface ResetCustomerDetailsAction {
    type: ActionType.RESET_CUSTOMER_DETAILS;
}

export interface ResetCustomersListAction {
    type: ActionType.RESET_CUSTOMERS_LIST;
}

export interface ResetCustomerStoreAction {
    type: ActionType.RESET_CUSTOMER_STORE_STATE;
}

export type KnownAction = RequestCustomersAction |
    ReceiveCustomersAction |
    RequestCustomerDetailsAction |
    ReceiveCustomerDetailsAction |
    ResetCustomerDetailsAction |
    ResetCustomersListAction |
    ResetCustomerStoreAction;
