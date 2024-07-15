import {
    isEmpty,
    isNil,
} from 'lodash';
import { DateTime } from 'luxon';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './payment.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DEFAULT_AMOUNT } from '../../../../common/constants';
import {
    ILogger,
    Logger,
} from '../../../../common/logging';
import { Amount } from '../../../../common/models';
import { numbersAreEqualWithPrecision } from '../../../../common/utilities/numericUtils';
import {
    formatWithTwoDecimalPlaces,
    isStringNullOrWhiteSpace,
} from '../../../../common/utilities/stringUtils';
import {
    Payment,
    InvoicePayment,
} from '../models';

const logger: ILogger = new Logger('Payment Reducer');

export interface PaymentStoreState {
    canSave: boolean;
    dirtyPayment: Payment | null;
    existingPayment: Payment | null;
    isFetching: boolean;
    isSaving: boolean;
}

const unloadedState: PaymentStoreState = {
    canSave: false,
    dirtyPayment: null,
    existingPayment: null,
    isFetching: false,
    isSaving: false,
};

const isPaymentValid = (payment: Payment): boolean => {
    const allRequiredAttributesAreSet = !isNil(payment.depositAccountId) &&
        !isNil(payment.revenueAccountId) &&
        !isNil(payment.paymentMethodId) &&
        !isNil(payment.paymentDate) &&
        !isNil(payment.amount) &&
        (payment.amount.amount ?? 0) > 0 &&
        !isStringNullOrWhiteSpace(payment.description);

    if (!allRequiredAttributesAreSet) {
        return false;
    }

    const selectedInvoices = payment.invoices.filter((i) => i.isSelected ?? false);

    if (isEmpty(selectedInvoices)) {
        return false;
    }

    const selectedInvoicePaymentsTotal = selectedInvoices
        .map((i) => i.paymentAmount.amount ?? 0)
        .reduce((prev, current) => prev += current, 0);

    return numbersAreEqualWithPrecision(payment.amount?.amount ?? 0, selectedInvoicePaymentsTotal);
};

const reducer: Reducer<PaymentStoreState> = (state: PaymentStoreState | undefined, incomingAction: Action): PaymentStoreState => {
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
                    paymentDate: DateTime.now().toISODate(),
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
                            paymentAmount: invoiceAmount,
                            isSelected: true,
                        },
                    ],
                };

                return {
                    ...state,
                    dirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_AMOUNT: {
                const updatedDirtyPayment = {
                    ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                    amount: {
                        ...state.dirtyPayment?.amount as Pick<Amount, keyof Amount>,
                        amount: action.amount,
                        amountAsString: action.amountAsString,
                    },
                };

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
                    dirtyPayment: updatedDirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_ARE_ALL_INVOICES_SELECTED: {
                const updatedDirtyPayment = {
                    ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                    invoices: state.dirtyPayment?.invoices?.map((i) => ({
                        ...i,
                        isSelected: action.isSelected,
                    })) ?? [],
                };

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
                    dirtyPayment: updatedDirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_CHECK_NUMBER:
                return {
                    ...state,
                    dirtyPayment: {
                        ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                        checkNumber: action.checkNumber,
                    },
                };

            case ActionType.UPDATE_PAYMENT_DATE: {
                const updatedDirtyPayment = {
                    ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                    paymentDate: action.date,
                };

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
                    dirtyPayment: updatedDirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_DEPOSIT_ACCOUNT: {
                const updatedDirtyPayment = {
                    ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                    depositAccountId: action.depositAccountId,
                };

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
                    dirtyPayment: updatedDirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_DESCRIPTION: {
                const updatedDirtyPayment = {
                    ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                    description: action.description,
                };

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
                    dirtyPayment: updatedDirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_INVOICE_AMOUNT: {
                const updatedDirtyPayment: Payment = { ...state.dirtyPayment as Pick<Payment, keyof Payment> };
                const existingInvoicePayments = updatedDirtyPayment.invoices;

                if (isEmpty(existingInvoicePayments)) {
                    logger.warn('No existing invoices associated to the the payment');
                    return state;
                }

                const indexOfSpecifiedInvoice = existingInvoicePayments.findIndex(
                    (i: InvoicePayment): boolean => i.invoiceId === action.invoiceId,
                );

                if (indexOfSpecifiedInvoice === -1) {
                    logger.warn(`Invoice with ID ${action.invoiceId} not presently in the invoices collection`)
                    return state;
                }

                const existingInvoicePayment = existingInvoicePayments[indexOfSpecifiedInvoice];
                const updatedInvoicePaymentAmount = { ...(existingInvoicePayment.paymentAmount ?? { ...DEFAULT_AMOUNT }) };
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

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
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

                const indexOfSpecifiedInvoice = existingInvoicePayments.findIndex(
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

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
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

            case ActionType.UPDATE_PAYMENT_METHOD: {
                const updatedDirtyPayment = {
                    ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                    paymentMethodId: action.paymentMethodId,
                };

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
                    dirtyPayment: updatedDirtyPayment,
                };
            }

            case ActionType.UPDATE_PAYMENT_REVENUE_ACCOUNT: {
                const updatedDirtyPayment = {
                    ...state.dirtyPayment as Pick<Payment, keyof Payment>,
                    revenueAccountId: action.revenueAccountId,
                };

                return {
                    ...state,
                    canSave: isPaymentValid(updatedDirtyPayment),
                    dirtyPayment: updatedDirtyPayment,
                };
            }
            /* END: UI Gesture Actions */

            /* BEGIN: Resets */
            case ActionType.RESET_PAYMENT_STORE_STATE:
                return unloadedState;
            /* END: Resets */

            default:
                return state;
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
