import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateTimeString } from '../../../../common/models';
import { Invoice } from '../../invoices/models';
import { Payment } from '../models';

/* BEGIN: REST API Actions */
interface RequestSaveNewPaymentAction extends IAction {
    type: ActionType.REQUEST_SAVE_NEW_PAYMENT;
}

interface NewPaymentSaveCompletedAction extends IAction {
    type: ActionType.NEW_PAYMENT_SAVE_COMPLETED;
    savedPayment: Payment;
}

interface SavePaymentErrorAction extends IAction {
    type: ActionType.SAVE_PAYMENT_ERROR;
}
/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
interface InitializeNewPaymentAction extends IAction {
    type: ActionType.INITIALIZE_NEW_PAYMENT;
    invoice: Invoice;
}

interface UpdatePaymentAmountAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_AMOUNT;
    amount: number | null; // New Amount / `null` to clear existing value
    amountAsString: string | null; // New Amount as originally entered / `null` to clear existing value
}

interface UpdatePaymentAreAllInvoicesSelectedAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_ARE_ALL_INVOICES_SELECTED;
    isSelected: boolean;
}

interface UpdatePaymentCheckNumberAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_CHECK_NUMBER;
    checkNumber: number | null;
}

interface UpdatePaymentDateAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_DATE;
    date: DateTimeString | null;
}

interface UpdatePaymentDepositAccountAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_DEPOSIT_ACCOUNT;
    depositAccountId: string | null; // GUID
}

interface UpdatePaymentDescriptionAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_DESCRIPTION;
    description: string | null;
}

interface UpdatePaymentInvoiceAmount extends IAction {
    type: ActionType.UPDATE_PAYMENT_INVOICE_AMOUNT;
    invoiceId: string;
    amount: number | null;
    amountAsString: string | null;
}

interface UpdatePaymentInvoiceIsSelectedAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_INVOICE_IS_SELECTED;
    invoiceId: string;
    isSelected: boolean;
}

interface UpdatePaymentIsPostedAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_IS_POSTED;
    isPosted: boolean;
}

interface UpdatePaymentMethodAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_METHOD;
    paymentMethodId: number | null; // integer
}

interface UpdatePaymentRevenueAccountAction extends IAction {
    type: ActionType.UPDATE_PAYMENT_REVENUE_ACCOUNT;
    revenueAccountId: string | null; // GUID
}
/* END: UI Gesture Actions */

/* BEGIN: Resets */
interface ResetPaymentStoreStateAction extends IAction {
    type: ActionType.RESET_PAYMENT_STORE_STATE;
}
/* END: Resets */

export type KnownAction = RequestSaveNewPaymentAction |
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
