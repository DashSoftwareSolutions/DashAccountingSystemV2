import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    find,
    isEmpty,
    isNil,
    map,
    reduce,
} from 'lodash';
import moment from 'moment-timezone';
import { AppThunkAction } from './';
import {
    DEFAULT_ASSET_TYPE,
    DEFAULT_INVOICE_TERMS,
} from '../common/Constants';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import AmountType from '../models/AmountType';
import AssetType from '../models/AssetType';
import IAction from './IAction';
import Invoice from '../models/Invoice';
import InvoiceLineItem from '../models/InvoiceLineItem';
import InvoiceLite from '../models/InvoiceLite';
import InvoiceStatus from '../models/InvoiceStatus';
import InvoiceTerms from '../models/InvoiceTerms';
import PagedResult from '../models/PagedResult';
import Tenant from '../models/Tenant';
import TimeActivity from '../models/TimeActivity';

// TODO: Validation state for Invoice Create/Update

export interface InvoiceListState {
    isLoading: boolean;
    results: PagedResult<InvoiceLite> | null;
    // TODO: Parameters for filtering the Invoice List
}

const DEFAULT_INVOICE_LIST_STATE: InvoiceListState = {
    isLoading: false,
    results: null,
};

export interface SingleInvoiceState {
    dirtyInvoice: Invoice | null;
    existingInvoice: Invoice | null;
    invoiceTermsOptions: InvoiceTerms[],
    isDeleting: boolean;
    isLoadingInvoice: boolean;
    isLoadingInvoiceTerms: boolean;
    isLoadingUnbilledTimeActivities: boolean;
    isSaving: boolean;
    unbilledTimeActivities: TimeActivity[];
    unbilledTimeActivitiesFilterStartDate: string | null;
    unbilledTimeActivitiesFilterEndDate: string | null;
}

const DEFAULT_SINGLE_INVOICE_STATE: SingleInvoiceState = {
    dirtyInvoice: null,
    existingInvoice: null,
    invoiceTermsOptions: [],
    isDeleting: false,
    isLoadingInvoice: false,
    isLoadingInvoiceTerms: false,
    isLoadingUnbilledTimeActivities: false,
    isSaving: false,
    unbilledTimeActivities: [],
    unbilledTimeActivitiesFilterStartDate: null,
    unbilledTimeActivitiesFilterEndDate: null,
};

export interface InvoiceStoreState {
    list: InvoiceListState;
    details: SingleInvoiceState;
}

const unloadedState: InvoiceStoreState = {
    list: { ...DEFAULT_INVOICE_LIST_STATE },
    details: { ...DEFAULT_SINGLE_INVOICE_STATE },
}

// Always have a logger in case we need to use it for debuggin'
const logger = new Logger('Invoice Store');

/* BEGIN: REST API Actions */
interface RequestInvoiceListAction extends IAction {
    type: ActionType.REQUEST_INVOICE_LIST;
}

interface ReceiveInvoiceListAction extends IAction {
    type: ActionType.RECEIVE_INVOICE_LIST;
    data: PagedResult<InvoiceLite>;
}

interface RequestInvoiceTermsAction extends IAction {
    type: ActionType.REQUEST_INVOICE_TERMS,
}

interface ReceiveInvoiceTermsAction extends IAction {
    type: ActionType.RECEIVE_INVOICE_TERMS,
    data: InvoiceTerms[],
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
    type: ActionType.UPDATE_INVOICE_CUSTOMER_EMAIL,
    customerEmail: string | null;
}

interface UpdateInvoiceTermsAction extends IAction {
    type: ActionType.UPDATE_INVOICE_TERMS;
    invoiceTermsId: string | null; // GUID
}

interface UpdateInvoiceIssueDateAction extends IAction {
    type: ActionType.UPDATE_INVOICE_ISSUE_DATE;
    issueDate: string | null; // Date as YYYY-MM-DD
}

interface UpdateInvoiceDueDateAction extends IAction {
    type: ActionType.UPDATE_INVOICE_DUE_DATE;
    dueDate: string | null; // Date as YYYY-MM-DD
}

interface UpdateInvoiceMessageAction extends IAction {
    type: ActionType.UPDATE_INVOICE_MESSAGE;
    message: string | null;
}

interface UpdateUnbilledTimeActivitiesFilterStartDateAction {
    type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_START_DATE;
    startDate: string | null; // Date in YYYY-MM-DD format
}

interface UpdateUnbilledTimeActivitiesFilterEndDateAction {
    type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_END_DATE;
    endDate: string | null; // Date in YYYY-MM-DD format
}

interface AddSelectedTimeActivitiesAsInvoiceLineItemsAction {
    type: ActionType.ADD_SELECTED_TIME_ACTIVITIES_AS_INVOICE_LINE_ITEMS,
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

type KnownAction = RequestInvoiceListAction |
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
    ResetInvoiceStoreAction;

export const actionCreators = {
    /* BEGIN: REST API Actions */
    requestInvoice: (invoiceNumber: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.invoice.details.isLoadingInvoice &&
            (isEmpty(appState.invoice?.details.existingInvoice) ||
                appState.invoice?.details.existingInvoice?.invoiceNumber !== invoiceNumber)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;

            fetch(`api/invoice/${tenantId}/${invoiceNumber}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<Invoice>
                })
                .then((invoice) => {
                    if (!isNil(invoice)) {
                        dispatch({ type: ActionType.RECEIVE_INVOICE, invoice });
                    }
                });

            dispatch({ type: ActionType.REQUEST_INVOICE });
        }
    },

    requestInvoiceList: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.invoice.list.isLoading &&
            isEmpty(appState.invoice?.list.results)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;

            fetch(`api/invoice/${tenantId}/list`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<PagedResult<InvoiceLite>>
                })
                .then((data) => {
                    if (!isNil(data)) {
                        dispatch({ type: ActionType.RECEIVE_INVOICE_LIST, data });
                    }
                });

            dispatch({ type: ActionType.REQUEST_INVOICE_LIST });
        }
    },

    requestInvoiceTerms: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.invoice.details.isLoadingInvoiceTerms &&
            isEmpty(appState.invoice?.details.invoiceTermsOptions)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;

            fetch(`api/invoice/${tenantId}/terms`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<InvoiceTerms[]>
                })
                .then((data) => {
                    if (!isNil(data)) {
                        dispatch({ type: ActionType.RECEIVE_INVOICE_TERMS, data });
                    }
                });

            dispatch({ type: ActionType.REQUEST_INVOICE_TERMS });
        }
    },

    requestUnbilledTimeActivities: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.invoice) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.invoice.details.isLoadingUnbilledTimeActivities &&
            !isNil(appState.invoice.details.dirtyInvoice?.customerId) &&
            !isNil(appState.invoice.details.unbilledTimeActivitiesFilterStartDate) &&
            !isNil(appState.invoice.details.unbilledTimeActivitiesFilterEndDate) &&
            isEmpty(appState.invoice?.details.unbilledTimeActivities)) {
            const customer = find(appState.customers?.list.customers, (c) => c.id === appState.invoice?.details.dirtyInvoice?.customerId);

            if (!isNil(customer)) {
                const accessToken = await authService.getAccessToken();
                const tenantId = appState?.tenants?.selectedTenant?.id;
                const requestUrl = `api/time-tracking/${tenantId}/unbilled-time-activities?customer=${customer.customerNumber}&dateRangeStart=${appState.invoice.details.unbilledTimeActivitiesFilterStartDate}&dateRangeEnd=${appState.invoice.details.unbilledTimeActivitiesFilterEndDate}`;

                fetch(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                            return null;
                        }

                        return response.json() as Promise<TimeActivity[]>
                    })
                    .then((timeActivities) => {
                        if (!isNil(timeActivities)) {
                            dispatch({ type: ActionType.RECEIVE_UNBILLED_TIME_ACTIVITIES, timeActivities });
                        }
                    });

                dispatch({ type: ActionType.REQUEST_UNBILLED_TIME_ACTIVITIES });
            }
        }
    },

    saveNewInvoice: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        const invoiceToSave: Invoice | null = appState.invoice?.details.dirtyInvoice ?? null;

        if (isNil(invoiceToSave)) {
            logger.warn('No Invoice found in store state.  Bailing out...');
            return;
        }

        // TODO: Make sure Invoice is valid to save

        const accessToken = await authService.getAccessToken();

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(invoiceToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('api/invoice', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler
                        .handleError(response, dispatch as Dispatch<IAction>)
                        .then(() => { dispatch({ type: ActionType.SAVE_INVOICE_ERROR }); });

                    return null;
                }

                return response.json() as Promise<Invoice>;
            })
            .then((savedInvoice) => {
                if (!isNil(savedInvoice)) {
                    dispatch({ type: ActionType.NEW_INVOICE_SAVE_COMPLETED, savedInvoice });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_INVOICE });
    },

    sendInvoice: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;
        const invoiceToSend = appState.invoice?.details.existingInvoice;

        if (isNil(invoiceToSend)) {
            logger.warn('No Invoice found in store state.  Bailing out.');
            return;
        }

        const accessToken = await authService.getAccessToken();

        const requestBody = {
            tenantId,
            invoiceNumber: invoiceToSend.invoiceNumber,
            status: InvoiceStatus.Sent,
        };

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`api/invoice/${tenantId}/${invoiceToSend.invoiceNumber}/status`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return null;
                }

                return response.json() as Promise<Invoice>;
            })
            .then((updatedInvoice) => {
                if (!isNil(updatedInvoice)) {
                    dispatch({ type: ActionType.SEND_INVOICE_COMPLETED, updatedInvoice });
                }
            });

        dispatch({ type: ActionType.REQUEST_SEND_INVOICE });
    },

    deleteInvoice: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;
        const accessToken = await authService.getAccessToken();
        const invoiceToDelete = appState.invoice?.details.existingInvoice;

        if (isNil(invoiceToDelete)) {
            logger.warn('No Invoice found in store state.  Bailing out.');
            return;
        }

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`api/invoice/${tenantId}/${invoiceToDelete.invoiceNumber}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    dispatch({ type: ActionType.DELETE_INVOICE_ERROR });
                    return;
                }

                dispatch({ type: ActionType.DELETE_INVOICE_COMPLETED });
            });

        dispatch({ type: ActionType.REQUEST_DELETE_INVOICE });
    },
    /* END: REST API Actions */

    /* BEGIN: UI Gesture Actions */
    initializeNewInvoice: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        const tenant = appState.tenants?.selectedTenant;

        if (isNil(tenant)) {
            logger.warn('No selected Tenant.  Cannot create Invoice.');
            return;
        }

        dispatch({ type: ActionType.INITIALIZE_NEW_INVOICE, tenant });
    },

    updateCustomer: (customerId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_INVOICE_CUSTOMER, customerId });
    },

    updateCustomerAddress: (customerAddress: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_INVOICE_CUSTOMER_ADDRESS, customerAddress });
    },

    updateCustomerEmail: (customerEmail: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_INVOICE_CUSTOMER_EMAIL, customerEmail });
    },

    updateInvoiceTerms: (invoiceTermsId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_INVOICE_TERMS, invoiceTermsId });
    },

    updateInvoiceIssueDate: (issueDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_INVOICE_ISSUE_DATE, issueDate });
    },

    updateInvoiceDueDate: (dueDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_INVOICE_DUE_DATE, dueDate });
    },

    updateInvoiceMessage: (message: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_INVOICE_MESSAGE, message });
    },

    updateUnbilledTimeActivitiesFilterStartDate: (startDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_START_DATE, startDate });
    },

    updateUnbilledTimeActivitiesFilterEndDate: (endDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_END_DATE, endDate });
    },

    addSelectedTimeActivitiesAsInvoiceLineItems: (timeActivities: TimeActivity[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        const assetType = appState.tenants?.selectedTenant?.defaultAssetType ?? DEFAULT_ASSET_TYPE;

        dispatch({
            type: ActionType.ADD_SELECTED_TIME_ACTIVITIES_AS_INVOICE_LINE_ITEMS,
            assetType,
            timeActivities
        });
    },
    /* END: UI Gesture Actions */

    /* BEGIN: Resets */
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_INVOICE_STORE_STATE });
    },

    resetDirtyInvoice: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_DIRTY_INVOICE });
    },

    resetExistingInvoice: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_EXISTING_INVOICE });
    },

    resetInvoiceList: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_INVOICE_LIST });
    },
    /* END: Resets */
};

const getDueDateBasedOnInvoiceTerms = (invoiceIssueDate: string, terms: InvoiceTerms): string | null => {
    const issueDateMoment = moment(invoiceIssueDate, 'YYYY-MM-DD');

    if (!isNil(terms.dueInDays)) {
        return moment(issueDateMoment).add(terms.dueInDays, 'days').format('YYYY-MM-DD');
    }

    if (!isNil(terms.dueOnDayOfMonth)) {
        let dueDate = moment(issueDateMoment).date(terms.dueOnDayOfMonth);

        if (dueDate.isSameOrBefore(issueDateMoment, 'day')) {
            dueDate.month(dueDate.month() + 1);
        }

        if (!isNil(terms.dueNextMonthThreshold)) {
            const diff = issueDateMoment.diff(dueDate, 'days');

            if (diff < terms.dueNextMonthThreshold) {
                dueDate.month(dueDate.month() + 1);
            }
        }

        return dueDate.format('YYYY-MM-DD');
    }

    return null;
};

export const reducer: Reducer<InvoiceStoreState> = (state: InvoiceStoreState | undefined, incomingAction: Action): InvoiceStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            /* BEGIN: REST API Actions */
            case ActionType.REQUEST_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isLoadingInvoice: true,
                    },
                };

            case ActionType.RECEIVE_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: action.invoice,
                        isLoadingInvoice: false,
                    },
                };

            case ActionType.REQUEST_INVOICE_LIST:
                return {
                    ...state,
                    list: {
                        ...state.list as Pick<InvoiceListState, keyof InvoiceListState>,
                        isLoading: true,
                    },
                };

            case ActionType.RECEIVE_INVOICE_LIST:
                return {
                    ...state,
                    list: {
                        ...state.list as Pick<InvoiceListState, keyof InvoiceListState>,
                        isLoading: false,
                        results: action.data,
                    },
                };

            case ActionType.REQUEST_INVOICE_TERMS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isLoadingInvoiceTerms: true,
                    },
                };

            case ActionType.RECEIVE_INVOICE_TERMS: {
                let dirtyInvoice = state.details.dirtyInvoice;
                const invoiceTermsOptions = action.data;

                if (!isNil(dirtyInvoice) &&
                    !isEmpty(invoiceTermsOptions) &&
                    dirtyInvoice.invoiceTermsId === null) {
                    const defaultTerms = find(invoiceTermsOptions, (t) => t.name === DEFAULT_INVOICE_TERMS);
                    let dueDate: string | null = null;

                    if (!isNil(defaultTerms) &&
                        !isNil(dirtyInvoice.issueDate)) {
                        dueDate = getDueDateBasedOnInvoiceTerms(dirtyInvoice.issueDate, defaultTerms);
                    }

                    dirtyInvoice = {
                        ...dirtyInvoice as Pick<Invoice, keyof Invoice>,
                        invoiceTermsId: defaultTerms?.id ?? null,
                        dueDate,
                    };
                }

                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isLoadingInvoiceTerms: false,
                        invoiceTermsOptions,
                        dirtyInvoice,
                    },
                };
            }

            case ActionType.REQUEST_UNBILLED_TIME_ACTIVITIES:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isLoadingUnbilledTimeActivities: true,
                    },
                };

            case ActionType.RECEIVE_UNBILLED_TIME_ACTIVITIES:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isLoadingUnbilledTimeActivities: false,
                        unbilledTimeActivities: action.timeActivities,
                    },
                };

            case ActionType.REQUEST_SAVE_NEW_INVOICE:
            case ActionType.REQUEST_SEND_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isSaving: true,
                    },
                };

            case ActionType.SAVE_INVOICE_ERROR:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isSaving: false,
                    },
                };

            case ActionType.NEW_INVOICE_SAVE_COMPLETED:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: action.savedInvoice,
                        isSaving: false,
                    },
                };

            case ActionType.SEND_INVOICE_COMPLETED:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: action.updatedInvoice,
                        isSaving: false,
                    },
                };

            case ActionType.REQUEST_DELETE_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isDeleting: true,
                    },
                };

            case ActionType.DELETE_INVOICE_COMPLETED:
                return unloadedState;

            case ActionType.DELETE_INVOICE_ERROR:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        isDeleting: false,
                    },
                };

            /* END: REST API Actions */

            /* BEGIN: UI Gesture Actions */
            case ActionType.INITIALIZE_NEW_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            tenantId: action.tenant.id,
                            status: InvoiceStatus.Draft,
                            issueDate: moment().format('YYYY-MM-DD'),
                            amount: {
                                amount: 0,
                                amountAsString: '0.00',
                                amountType: AmountType.Debit,
                                assetType: action.tenant.defaultAssetType,
                            },
                            dueDate: null,
                            customerId: null,
                            customerAddress: null,
                            customerEmail: null,
                            invoiceTermsId: null,
                            message: null,
                            lineItems: [],
                        },
                    }
                };

            case ActionType.UPDATE_INVOICE_CUSTOMER:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            customerId: action.customerId,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_CUSTOMER_ADDRESS:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            customerAddress: action.customerAddress,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_CUSTOMER_EMAIL:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            customerEmail: action.customerEmail,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_DUE_DATE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            dueDate: action.dueDate,
                        },
                    },
                };

            case ActionType.UPDATE_INVOICE_ISSUE_DATE: {
                let dirtyInvoice = {
                    ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                    issueDate: action.issueDate,
                };

                if (!isNil(dirtyInvoice.invoiceTermsId)) {
                    const selectedTerms = find(state.details.invoiceTermsOptions, (ito) => ito.id === dirtyInvoice.invoiceTermsId);

                    if (!isNil(selectedTerms) &&
                        !isNil(dirtyInvoice.issueDate)) {
                        const dueDate = getDueDateBasedOnInvoiceTerms(dirtyInvoice.issueDate, selectedTerms);

                        dirtyInvoice = {
                            ...dirtyInvoice,
                            dueDate,
                        };
                    }
                }

                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice,
                    },
                };
            }

            case ActionType.UPDATE_INVOICE_TERMS: {
                let dirtyInvoice = {
                    ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                    invoiceTermsId: action.invoiceTermsId,
                };

                if (!isNil(action.invoiceTermsId)) {
                    const selectedTerms = find(state.details.invoiceTermsOptions, (ito) => ito.id === action.invoiceTermsId);

                    if (!isNil(selectedTerms) &&
                        !isNil(dirtyInvoice.issueDate)) {
                        const dueDate = getDueDateBasedOnInvoiceTerms(dirtyInvoice.issueDate, selectedTerms);

                        dirtyInvoice = {
                            ...dirtyInvoice,
                            dueDate,
                        };
                    }
                }

                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice,
                    },
                };
            }

            case ActionType.UPDATE_INVOICE_MESSAGE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            message: action.message,
                        },
                    },
                };

            case ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_START_DATE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        unbilledTimeActivitiesFilterStartDate: action.startDate,
                    },
                };

            case ActionType.UPDATE_UNBILLED_TIME_ACTIVITIES_FILTER_END_DATE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        unbilledTimeActivitiesFilterEndDate: action.endDate,
                    },
                };

            case ActionType.ADD_SELECTED_TIME_ACTIVITIES_AS_INVOICE_LINE_ITEMS: {
                logger.info('Here come the Time Activities!', action.timeActivities);

                const existingLineItems = state.details.dirtyInvoice?.lineItems ?? [];
                const maxExistingOrderNumber = reduce(
                    map(existingLineItems, (li) => li.orderNumber),
                    (prevMax, current) => current > prevMax ? current : prevMax,
                    0);

                let nextOrderNumber = maxExistingOrderNumber;

                const newLineItems = map(
                    action.timeActivities,
                    (ta: TimeActivity): InvoiceLineItem => {
                        const quantity = moment.duration(ta.totalTime).asHours();

                        return {
                            id: null,
                            orderNumber: ++nextOrderNumber,
                            date: ta.date,
                            productId: ta.productId,
                            productOrService: ta.product?.name,
                            productCategory: ta.product?.category,
                            description: ta.description,
                            quantity,
                            unitPrice: {
                                amount: ta.hourlyBillingRate ?? 0,
                                amountType: AmountType.Debit,
                                assetType: action.assetType,
                            },
                            total: {
                                amount: quantity * (ta.hourlyBillingRate ?? 0),
                                amountType: AmountType.Debit,
                                assetType: action.assetType,
                            },
                            timeActivityId: ta.id ?? '',
                        };
                    },
                );

                const updatedLineItems = [...existingLineItems, ...newLineItems];

                const invoiceTotal = reduce(
                    map(updatedLineItems, (li) => li.total?.amount ?? 0),
                    (sum, next) => (sum + next),
                    0);


                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            ...state.details.dirtyInvoice as Pick<Invoice, keyof Invoice>,
                            lineItems: updatedLineItems,
                            amount: {
                                amount: invoiceTotal,
                                amountType: AmountType.Debit,
                                assetType: action.assetType,
                            },
                        },
                    },
                };
            }
            /* END: UI Gesture Actions */

            /* BEGIN: Resets */
            case ActionType.RESET_INVOICE_LIST:
                return {
                    ...state,
                    list: { ...DEFAULT_INVOICE_LIST_STATE },
                };

            case ActionType.RESET_DIRTY_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: null,
                    },
                };

            case ActionType.RESET_EXISTING_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        existingInvoice: null,
                    },
                };

            case ActionType.RESET_INVOICE_STORE_STATE:
                return unloadedState;
            /* END: Resets */

            default:
                return state;
        }
    }

    return state;
};
    