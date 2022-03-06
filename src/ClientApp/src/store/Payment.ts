import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    findIndex,
    isEmpty,
    isNil,
    map,
} from 'lodash';
import moment from 'moment-timezone';
import { AppThunkAction } from './';
import {
    DEFAULT_AMOUNT,
} from '../common/Constants';
import { formatWithTwoDecimalPlaces } from '../common/StringUtils';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import Amount from '../models/Amount';
import IAction from './IAction';
import Invoice from '../models/Invoice';
import InvoicePayment from '../models/InvoicePayment';
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

interface UpdatePaymentAmountAction {
    type: ActionType.UPDATE_PAYMENT_AMOUNT;
    amount: number | null; // New Amount / `null` to clear existing value
    amountAsString: string | null; // New Amount as originally entered / `null` to clear existing value
}

interface UpdatePaymentAreAllInvoicesSelectedAction {
    type: ActionType.UPDATE_PAYMENT_ARE_ALL_INVOICES_SELECTED;
    isSelected: boolean;
}

interface UpdatePaymentCheckNumberAction {
    type: ActionType.UPDATE_PAYMENT_CHECK_NUMBER;
    checkNumber: number | null;
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

interface UpdatePaymentInvoiceAmount {
    type: ActionType.UPDATE_PAYMENT_INVOICE_AMOUNT;
    invoiceId: string;
    amount: number | null;
    amountAsString: string | null;
}

interface UpdatePaymentInvoiceIsSelectedAction {
    type: ActionType.UPDATE_PAYMENT_INVOICE_IS_SELECTED;
    invoiceId: string;
    isSelected: boolean;
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
    UpdatePaymentAmountAction |
    UpdatePaymentAreAllInvoicesSelectedAction |
    UpdatePaymentCheckNumberAction |
    UpdatePaymentDateAction |
    UpdatePaymentDepositAccountAction |
    UpdatePaymentDescriptionAction |
    UpdatePaymentInvoiceAmount |
    UpdatePaymentInvoiceIsSelectedAction |
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

    updatePaymentAmount: (amountAsString: string | null, amount: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_AMOUNT, amount, amountAsString });
    },

    updatePaymentCheckNumber: (checkNumber: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_CHECK_NUMBER, checkNumber });
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

    updatePaymentInvoiceAmount: (invoiceId: string, amountAsString: string | null, amount: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PAYMENT_INVOICE_AMOUNT,
            invoiceId,
            amountAsString,
            amount,
        });
    },

    updatePaymentInvoiceIsSelected: (invoiceId: string, isSelected: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_INVOICE_IS_SELECTED, invoiceId, isSelected });
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

    updatePaymentSelectAllInvoices: (isSelected: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PAYMENT_ARE_ALL_INVOICES_SELECTED, isSelected });
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
                const invoiceAmount: Amount = isNil(action.invoice.amount) ?
                    DEFAULT_AMOUNT :
                    {
                        ...action.invoice.amount,
                        amountAsString: formatWithTwoDecimalPlaces((action.invoice.amount.amount ?? 0).toString()),
                    };

                const dirtyPayment: Payment = {
                    tenantId: action.invoice.tenantId,
                    customerId: action.invoice.customerId,
                    customer: action.invoice.customer,
                    depositAccountId: null,
                    revenueAccountId: null,
                    paymentMethodId: null,
                    paymentDate: moment().format('YYYY-MM-DD'),
                    amount: invoiceAmount,
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
                            amount: invoiceAmount,
                            isSelected: true,
                        },
                    ],
                };

                return {
                    ...state,
                    dirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_AMOUNT:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        amount: {
                            ...state.dirtyPayment?.amount as Pick<Amount, keyof Amount>,
                            amount: action.amount,
                            amountAsString: action.amountAsString,
                        },
                    },
                };

            case ActionType.UPDATE_PAYMENT_ARE_ALL_INVOICES_SELECTED:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        invoices: map(state.dirtyPayment?.invoices, (i) => ({
                            ...i,
                            isSelected: action.isSelected,
                        })),
                    },
                };

            case ActionType.UPDATE_PAYMENT_CHECK_NUMBER:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        checkNumber: action.checkNumber,
                    },
                };

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

            case ActionType.UPDATE_PAYMENT_INVOICE_AMOUNT: {
                const updatedDirtyPayment: Payment = { ...state.dirtyPayment as Pick<Payment, keyof Payment> };
                const existingInvoicePayments = updatedDirtyPayment.invoices;

                if (isEmpty(existingInvoicePayments)) {
                    logger.warn('No existing invoices associated to the the payment');
                    return state;
                }

                const indexOfSpecifiedInvoice = findIndex(
                    existingInvoicePayments,
                    (i: InvoicePayment): boolean => i.invoiceId === action.invoiceId,
                );

                if (indexOfSpecifiedInvoice === -1) {
                    logger.warn(`Invoice with ID ${action.invoiceId} not presently in the invoices collection`)
                    return state;
                }

                const existingInvoicePayment = existingInvoicePayments[indexOfSpecifiedInvoice];
                const updatedInvoicePaymentAmount = { ...(existingInvoicePayment.amount ?? { ...DEFAULT_AMOUNT }) };
                updatedInvoicePaymentAmount.amountAsString = action.amountAsString;
                updatedInvoicePaymentAmount.amount = action.amount;

                const updatedInvoicePayment = {
                    ...existingInvoicePayment,
                    amount: updatedInvoicePaymentAmount,
                };

                updatedDirtyPayment.invoices = [
                    ...existingInvoicePayments.slice(0, indexOfSpecifiedInvoice),
                    updatedInvoicePayment,
                    ...existingInvoicePayments.slice(indexOfSpecifiedInvoice + 1),
                ];

                // TODO: Validation (i.e. ensuring the sum of the selected invoice payment amount(s) equals the total payment amount)

                return {
                    ...state,
                    dirtyPayment: updatedDirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_INVOICE_IS_SELECTED: {
                const updatedDirtyPayment: Payment = { ...state.dirtyPayment as Pick<Payment, keyof Payment> };
                const existingInvoicePayments = updatedDirtyPayment.invoices;

                if (isEmpty(existingInvoicePayments)) {
                    logger.warn('No existing invoices associated to the the payment');
                    return state;
                }

                const indexOfSpecifiedInvoice = findIndex(
                    existingInvoicePayments,
                    (i: InvoicePayment): boolean => i.invoiceId === action.invoiceId,
                );

                if (indexOfSpecifiedInvoice === -1) {
                    logger.warn(`Invoice with ID ${action.invoiceId} not presently in the invoices collection`)
                    return state;
                }

                const existingInvoicePayment = existingInvoicePayments[indexOfSpecifiedInvoice];

                const updatedInvoicePayment = {
                    ...existingInvoicePayment,
                    isSelected: action.isSelected,
                };

                updatedDirtyPayment.invoices = [
                    ...existingInvoicePayments.slice(0, indexOfSpecifiedInvoice),
                    updatedInvoicePayment,
                    ...existingInvoicePayments.slice(indexOfSpecifiedInvoice + 1),
                ];

                // TODO: Validation (i.e. ensuring the sum of the selected invoice payment amount(s) equals the total payment amount)

                return {
                    ...state,
                    dirtyPayment: updatedDirtyPayment,
                };
            }

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