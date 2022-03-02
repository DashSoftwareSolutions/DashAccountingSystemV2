import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    cloneDeep,
    find,
    isEmpty,
    isNil,
    trim,
} from 'lodash';
import moment from 'moment-timezone';
import { AppThunkAction } from './';
import {
    formatWithTwoDecimalPlaces,
    isStringNullOrWhiteSpace,
} from '../common/StringUtils';
import { Logger } from '../common/Logging';
import { numbersAreEqualWithPrecision } from '../common/NumericUtils';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import CustomerLite from '../models/CustomerLite';
import IAction from './IAction';
import Invoice from '../models/Invoice';
import Payment from '../models/Payment';

export interface PaymentStoreState {
    canSave: boolean;
    dirtyPayment: Payment | null;
    isLoading: boolean;
    isSaving: boolean;
}

/* BEGIN: REST API Actions */
/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
/* END: UI Gesture Actions */

/* BEGIN: Resets */
/* END: Resets */

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Payment Store');

export const actionCreators = {
    /* BEGIN: REST API Actions */
    /* END: REST API Actions */

    /* BEGIN: UI Gesture Actions */
    /* END: UI Gesture Actions */

    /* BEGIN: Resets */
    /* END: Resets */
};

const today = moment().format('YYYY-MM-DD');

const unloadedState: PaymentStoreState = {
    canSave: false,
    dirtyPayment: null,
    isLoading: false,
    isSaving: false,
};

export const reducer: Reducer<PaymentStoreState> = (state: PaymentStoreState | undefined, incomingAction: Action): PaymentStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    return state;
};