import {
    RequestDownloadAction,
    ReceiveDownloadErrorAction,
    ReceiveDownloadInfoAction,
} from '../../../../app/export/export.actions';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    AssetType,
    DateTimeString,
    PagedResult,
    Tenant,
} from '../../../../common/models';
import { TimeActivity } from '../../../time-tracking/time-activities/models';
import {
    Invoice,
    InvoiceLite,
    InvoiceTerms,
} from '../models';

/* BEGIN: REST API Actions */
interface RequestInvoiceListAction extends IAction {
    type: ActionType.REQUEST_INVOICE_LIST;
}

interface ReceiveInvoiceListAction extends IAction {
    type: ActionType.RECEIVE_INVOICE_LIST;
    data: PagedResult<InvoiceLite>;
}

interface RequestInvoiceTermsAction extends IAction {
    type: ActionType.REQUEST_INVOICE_TERMS;
}

interface ReceiveInvoiceTermsAction extends IAction {
    type: ActionType.RECEIVE_INVOICE_TERMS;
    data: InvoiceTerms[];
}

interface RequestUnbilledTimeActivitiesAction extends IAction {
    type: ActionType.REQUEST_UNBILLED_TIME_ACTIVITIES;
}

interface ReceiveUnbilledTimeActivitiesAction extends IAction {
    type: ActionType.RECEIVE_UNBILLED_TIME_ACTIVITIES;
    timeActivities: TimeActivity[];
}

interface RequestSaveNewInvoiceAction extends IAction {
    type: ActionType.REQUEST_SAVE_NEW_INVOICE;
}

interface NewInvoiceSaveCompletedAction extends IAction {
    type: ActionType.NEW_INVOICE_SAVE_COMPLETED;
    savedInvoice: Invoice;
}

interface SaveInvoiceErrorAction extends IAction {
    type: ActionType.SAVE_INVOICE_ERROR;
}

interface RequestInvoiceAction extends IAction {
    type: ActionType.REQUEST_INVOICE;
}

interface ReceiveInvoiceAction extends IAction {
    type: ActionType.RECEIVE_INVOICE;
    invoice: Invoice;
}

interface RequestSendInvoiceAction extends IAction {
    type: ActionType.REQUEST_SEND_INVOICE;
}

interface SendInvoiceCompletedAction extends IAction {
    type: ActionType.SEND_INVOICE_COMPLETED;
    updatedInvoice: Invoice;
}

interface RequestDeleteInvoiceAction extends IAction {
    type: ActionType.REQUEST_DELETE_INVOICE;
}

interface DeleteInvoiceCompletedAction extends IAction {
    type: ActionType.DELETE_INVOICE_COMPLETED;
}

interface DeleteInvoiceErrorAction extends IAction {
    type: ActionType.DELETE_INVOICE_ERROR;
}
/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
interface InitializeNewInvoiceAction extends IAction {
    type: ActionType.INITIALIZE_NEW_INVOICE;
    tenant: Tenant;
}

interface UpdateCustomerAction extends IAction {
    type: ActionType.UPDATE_INVOICE_CUSTOMER;
    customerId: string | null; // GUID
}

interface UpdateCustomerAddressAction extends IAction {
    type: ActionType.UPDATE_INVOICE_CUSTOMER_ADDRESS;
    customerAddress: string | null;
}

interface UpdateCustomerEmailAction extends IAction {
    type: ActionType.UPDATE_INVOICE_CUSTOMER_EMAIL;
    customerEmail: string | null;
}

interface UpdateInvoiceTermsAction extends IAction {
    type: ActionType.UPDATE_INVOICE_TERMS;
    invoiceTermsId: string | null; // GUID
}

interface UpdateInvoiceIssueDateAction extends IAction {
    type: ActionType.UPDATE_INVOICE_ISSUE_DATE;
    issueDate: DateTimeString | null; // Date as YYYY-MM-DD
}

interface UpdateInvoiceDueDateAction extends IAction {
    type: ActionType.UPDATE_INVOICE_DUE_DATE;
    dueDate: DateTimeString | null; // Date as YYYY-MM-DD
}

interface UpdateInvoiceMessageAction extends IAction {
    type: ActionType.UPDATE_INVOICE_MESSAGE;
    message: string | null;
}

interface UpdateUnbilledTimeActivitiesFilterStartDateAction {
    type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_START_DATE;
    startDate: DateTimeString | null; // Date in YYYY-MM-DD format
}

interface UpdateUnbilledTimeActivitiesFilterEndDateAction {
    type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_END_DATE;
    endDate: DateTimeString | null; // Date in YYYY-MM-DD format
}

interface AddSelectedTimeActivitiesAsInvoiceLineItemsAction {
    type: ActionType.ADD_SELECTED_TIME_ACTIVITIES_AS_INVOICE_LINE_ITEMS;
    assetType: AssetType;
    timeActivities: TimeActivity[];
}
/* END: UI Gesture Actions */

/* BEGIN: Resets */
interface ResetInvoiceListAction extends IAction {
    type: ActionType.RESET_INVOICE_LIST;
}

interface ResetDirtyInvoiceAction extends IAction {
    type: ActionType.RESET_DIRTY_INVOICE;
}

interface ResetExistingInvoiceAction extends IAction {
    type: ActionType.RESET_EXISTING_INVOICE;
}

interface ResetInvoiceStoreAction extends IAction {
    type: ActionType.RESET_INVOICE_STORE_STATE;
}
/* END: Resets */

export type KnownAction = RequestInvoiceListAction |
    ReceiveInvoiceListAction |
    RequestInvoiceTermsAction |
    ReceiveInvoiceTermsAction |
    RequestUnbilledTimeActivitiesAction |
    ReceiveUnbilledTimeActivitiesAction |
    RequestSaveNewInvoiceAction |
    SaveInvoiceErrorAction |
    RequestInvoiceAction |
    ReceiveInvoiceAction |
    NewInvoiceSaveCompletedAction |
    RequestSendInvoiceAction |
    SendInvoiceCompletedAction |
    RequestDeleteInvoiceAction |
    DeleteInvoiceCompletedAction |
    DeleteInvoiceErrorAction |
    InitializeNewInvoiceAction |
    UpdateCustomerAction |
    UpdateCustomerAddressAction |
    UpdateCustomerEmailAction |
    UpdateInvoiceTermsAction |
    UpdateInvoiceIssueDateAction |
    UpdateInvoiceDueDateAction |
    UpdateInvoiceMessageAction |
    UpdateUnbilledTimeActivitiesFilterStartDateAction |
    UpdateUnbilledTimeActivitiesFilterEndDateAction |
    AddSelectedTimeActivitiesAsInvoiceLineItemsAction |
    ResetInvoiceListAction |
    ResetDirtyInvoiceAction |
    ResetExistingInvoiceAction |
    ResetInvoiceStoreAction |
    RequestDownloadAction |
    ReceiveDownloadErrorAction |
    ReceiveDownloadInfoAction;
