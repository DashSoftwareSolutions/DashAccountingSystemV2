import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    isNil,
} from 'lodash';
import moment from 'moment-timezone';
import { AppThunkAction } from './';
import {
    DEFAULT_AMOUNT,
} from '../common/Constants';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import IAction from './IAction';
import Invoice from '../models/Invoice';
import Payment from '../models/Payment';

export interface PaymentStoreState {
    canSave: boolean;
    dirtyPayment: Payment | null;
    existingPayment: Payment | null;
    isLoading: boolean;
    isSaving: boolean;
}

/* BEGIN: REST API Actions */
interface RequestSaveNewPaymentAction {
    type: ActionType.REQUEST_SAVE_NEW_PAYMENT;
}

interface NewPaymentSaveCompletedAction {
    type: ActionType.NEW_PAYMENT_SAVE_COMPLETED;
    savedPayment: Payment;
}

interface SavePaymentErrorAction {
    type: ActionType.SAVE_PAYMENT_ERROR;
}
/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
interface InitializeNewPaymentAction {
    type: ActionType.INITIALIZE_NEW_PAYMENT;
    invoice: Invoice;
}

interface UpdatePaymentDateAction {
    type: ActionType.UPDATE_PAYMENT_DATE;
    date: string | null; // Date in YYYY-MM-DD
}

interface UpdatePaymentDepositAccountAction {
    type: ActionType.UPDATE_PAYMENT_DEPOSIT_ACCOUNT;
    depositAccountId: string | null; // GUID
}

interface UpdatePaymentDescriptionAction {
    type: ActionType.UPDATE_PAYMENT_DESCRIPTION;
    description: string | null;
}

interface UpdatePaymentIsPostedAction {
    type: ActionType.UPDATE_PAYMENT_IS_POSTED;
    isPosted: boolean;
}

interface UpdatePaymentMethodAction {
    type: ActionType.UPDATE_PAYMENT_METHOD;
    paymentMethodId: number | null; // integer
}

interface UpdatePaymentRevenueAccountAction {
    type: ActionType.UPDATE_PAYMENT_REVENUE_ACCOUNT;
    revenueAccountId: string | null; // GUID
}
/* END: UI Gesture Actions */

/* BEGIN: Resets */
interface ResetPaymentStoreStateAction {
    type: ActionType.RESET_PAYMENT_STORE_STATE;
}
/* END: Resets */

type KnownAction = RequestSaveNewPaymentAction |
    NewPaymentSaveCompletedAction |
    SavePaymentErrorAction |
    InitializeNewPaymentAction |
    UpdatePaymentDateAction |
    UpdatePaymentDepositAccountAction |
    UpdatePaymentDescriptionAction |
    UpdatePaymentIsPostedAction |
    UpdatePaymentMethodAction |
    UpdatePaymentRevenueAccountAction |
    ResetPaymentStoreStateAction;

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Payment Store');

export const actionCreators = {
    /* BEGIN: REST API Actions */
    saveNewPayment: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        const paymentToSave: Payment | null = appState.payment?.dirtyPayment ?? null;

        if (isNil(paymentToSave)) {
            logger.warn('No Payment found in store state.  Bailing out...');
            return;
        }

        // TODO: Make sure Payment is valid to save
        const accessToken = await authService.getAccessToken();

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(paymentToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('api/payment', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler
                        .handleError(response, dispatch as Dispatch<IAction>)
                        .then(() => { dispatch({ type: ActionType.SAVE_PAYMENT_ERROR }); });

                    return null;
                }

                return response.json() as Promise<Payment>;
            })
            .then((savedPayment) => {
                if (!isNil(savedPayment)) {
                    dispatch({ type: ActionType.NEW_PAYMENT_SAVE_COMPLETED, savedPayment });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_PAYMENT });
    },
    /* END: REST API Actions */

    /* BEGIN: UI Gesture Actions */
    initializeNewPayment: (invoice: Invoice): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.INITIALIZE_NEW_PAYMENT, invoice });
    },

    updatePaymentDate: (date: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_DATE, date });
    },

    updatePaymentDepositAccount: (depositAccountId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_DEPOSIT_ACCOUNT, depositAccountId });
    },

    updatePaymentDescription: (description: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_DESCRIPTION, description });
    },

    updatePaymentIsPosted: (isPosted: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_IS_POSTED, isPosted });
    },

    updatePaymentMethod: (paymentMethodId: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_METHOD, paymentMethodId });
    },

    updatePaymentRevenueAccount: (revenueAccountId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_REVENUE_ACCOUNT, revenueAccountId });
    },
    /* END: UI Gesture Actions */

    /* BEGIN: Resets */
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_PAYMENT_STORE_STATE });
    },
    /* END: Resets */
};

const unloadedState: PaymentStoreState = {
    canSave: false,
    dirtyPayment: null,
    existingPayment: null,
    isLoading: false,
    isSaving: false,
};

export const reducer: Reducer<PaymentStoreState> = (state: PaymentStoreState | undefined, incomingAction: Action): PaymentStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            /* BEGIN: REST API Actions */
            case ActionType.REQUEST_SAVE_NEW_PAYMENT:
                return {
                    ...state,
                    isSaving: true,
                };

            case ActionType.NEW_PAYMENT_SAVE_COMPLETED:
                return {
                    ...state,
                    isSaving: false,
                    existingPayment: action.savedPayment,
                };

            case ActionType.SAVE_PAYMENT_ERROR:
                return {
                    ...state,
                    isSaving: false,
                };
            /* END: REST API Actions */

            /* BEGIN: UI Gesture Actions */
            case ActionType.INITIALIZE_NEW_PAYMENT: {
                const dirtyPayment: Payment = {
                    tenantId: action.invoice.tenantId,
                    customerId: action.invoice.customerId,
                    customer: action.invoice.customer,
                    depositAccountId: null,
                    revenueAccountId: null,
                    paymentMethodId: null,
                    paymentDate: moment().format('YYYY-MM-DD'),
                    amount: action.invoice.amount ?? DEFAULT_AMOUNT,
                    description: '',
                    checkNumber: null,
                    isPosted: false,
                    invoices: [
                        {
                            invoiceId: action.invoice.id ?? '',
                            invoice: {
                                id: action.invoice.id ?? '',
                                invoiceNumber: action.invoice.invoiceNumber ?? 0,
                                customerName: action.invoice.customer?.displayName ?? '',
                                amount: action.invoice.amount ?? DEFAULT_AMOUNT,
                                dueDate: action.invoice.dueDate ?? '',
                                issueDate: action.invoice.issueDate ?? '',
                                terms: action.invoice.invoiceTerms?.name ?? '',
                                status: action.invoice.status,
                            },
                            amount: action.invoice.amount ?? DEFAULT_AMOUNT,
                        }
                    ],
                };

                return {
                    ...state,
                    dirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_DATE:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        paymentDate: action.date,
                    },
                };

            case ActionType.UPDATE_PAYMENT_DEPOSIT_ACCOUNT:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        depositAccountId: action.depositAccountId,
                    },
                };

            case ActionType.UPDATE_PAYMENT_DESCRIPTION:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        description: action.description,
                    },
                };

            case ActionType.UPDATE_PAYMENT_IS_POSTED:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        isPosted: action.isPosted,
                    },
                };

            case ActionType.UPDATE_PAYMENT_METHOD:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        paymentMethodId: action.paymentMethodId,
                    },
                };

            case ActionType.UPDATE_PAYMENT_REVENUE_ACCOUNT:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        revenueAccountId: action.revenueAccountId,
                    },
                };
            /* END: UI Gesture Actions */

            /* BEGIN: Resets */
            case ActionType.RESET_PAYMENT_STORE_STATE:
                return unloadedState;
            /* END: Resets */

            default:
                return state;
        }
    }

    return state;
};