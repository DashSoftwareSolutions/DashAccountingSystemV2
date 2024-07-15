import { isNil } from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './customers.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    Customer,
    CustomerLite,
} from '../models';

interface CustomerListState {
    isFetching: boolean;
    customers: CustomerLite[];
}

const DEFAULT_CUSTOMER_LIST_STATE: CustomerListState = {
    isFetching: false,
    customers: [],
};

interface SingleCustomerState {
    isFetching: boolean;
    customer: Customer | null;
}

const DEFAULT_SINGLE_CUSTOMER_STATE: SingleCustomerState = {
    isFetching: false,
    customer: null,
};

export interface CustomerStoreState {
    list: CustomerListState;
    details: SingleCustomerState;
}

const unloadedState: CustomerStoreState = {
    list: { ...DEFAULT_CUSTOMER_LIST_STATE },
    details: { ...DEFAULT_SINGLE_CUSTOMER_STATE },
};

const reducer: Reducer<CustomerStoreState> = (state: CustomerStoreState | undefined, incomingAction: Action): CustomerStoreState => {
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
                        isFetching: true,
                    },
                };

            case ActionType.RECEIVE_CUSTOMERS:
                return {
                    ...state,
                    list: {
                        ...state.list as Pick<CustomerListState, keyof CustomerListState>,
                        isFetching: false,
                        customers: action.customers,
                    },
                };

            case ActionType.REQUEST_CUSTOMER_DETAILS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleCustomerState, keyof SingleCustomerState>,
                        isFetching: true,
                    },
                };

            case ActionType.RECEIVE_CUSTOMER_DETAILS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleCustomerState, keyof SingleCustomerState>,
                        isFetching: false,
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

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
