import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    cloneDeep,
    filter,
    find,
    findIndex,
    groupBy,
    isEmpty,
    isNil,
    keys,
    map,
    reduce,
    trim,
} from 'lodash';
import * as moment from 'moment-timezone';
import { AppThunkAction } from './';
import { DEFAULT_INVOICE_TERMS } from '../common/Constants';
import { isStringNullOrWhiteSpace } from '../common/StringUtils';
import { Logger } from '../common/Logging';
import { numbersAreEqualWithPrecision } from '../common/NumericUtils';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import Amount from '../models/Amount';
import AmountType from '../models/AmountType';
import IAction from './IAction';
import Invoice from '../models/Invoice';
import InvoiceLineItem from '../models/InvoiceLineItem';
import InvoiceLite from '../models/InvoiceLite';
import InvoiceStatus from '../models/InvoiceStatus';
import InvoiceTerms from '../models/InvoiceTerms';
import PagedResult from '../models/PagedResult';
import TimeActivity from '../models/TimeActivity';

// TODO: Validation state for Invoice CRUD

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
    isLoadingInvoice: boolean;
    isLoadingInvoiceTerms: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    invoiceTermsOptions: InvoiceTerms[],
    dirtyInvoice: Invoice | null;
}

const DEFAULT_SINGLE_INVOICE_STATE: SingleInvoiceState = {
    isLoadingInvoice: false,
    isLoadingInvoiceTerms: false,
    isSaving: false,
    isDeleting: false,
    invoiceTermsOptions: [],
    dirtyInvoice: null,
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
/* END: REST API Actions */
/* BEGIN: UI Gesture Actions */
interface InitializeNewInvoiceAction extends IAction {
    type: ActionType.INITIALIZE_NEW_INVOICE;
    tenantId: string; // GUID
}
/* END: UI Gesture Actions */
/* BEGIN: Resets */
interface ResetInvoiceListAction extends IAction {
    type: ActionType.RESET_INVOICE_LIST;
}

interface ResetDirtyInvoiceAction extends IAction {
    type: ActionType.RESET_DIRTY_INVOICE;
}

interface ResetInvoiceStoreAction extends IAction {
    type: ActionType.RESET_INVOICE_STORE_STATE;
}
/* END: Resets */

type KnownAction = RequestInvoiceListAction |
    ReceiveInvoiceListAction |
    RequestInvoiceTermsAction |
    ReceiveInvoiceTermsAction |
    InitializeNewInvoiceAction |
    ResetInvoiceListAction |
    ResetDirtyInvoiceAction |
    ResetInvoiceStoreAction;

export const actionCreators = {
    /* BEGIN: REST API Actions */
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
    /* END: REST API Actions */

    /* BEGIN: UI Gesture Actions */
    initializeNewInvoice: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;

        if (isNil(tenantId)) {
            logger.warn('No selected Tenant.  Cannot create Invoice.');
            return;
        }

        dispatch({ type: ActionType.INITIALIZE_NEW_INVOICE, tenantId });
    },
    /* END: UI Gesture Actions */

    /* BEGIN: Resets */
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_INVOICE_STORE_STATE });
    },

    resetDirtyInvoice: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_DIRTY_INVOICE });
    },

    resetInvoiceList: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_INVOICE_LIST });
    },
    /* END: Resets */
};

const getDueDateBasedOnInvoiceTerms = (invoiceIssueDate: string, terms: InvoiceTerms): string | null => {
    const issueDateMoment = moment.default(invoiceIssueDate, 'YYYY-MM-DD');

    if (!isNil(terms.dueInDays)) {
        return moment.default(issueDateMoment).add(terms.dueInDays, 'days').format('YYYY-MM-DD');
    }

    if (!isNil(terms.dueOnDayOfMonth)) {
        let dueDate = moment.default(issueDateMoment).date(terms.dueOnDayOfMonth);

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
            /* END: REST API Actions */

            /* BEGIN: UI Gesture Actions */
            case ActionType.INITIALIZE_NEW_INVOICE:
                return {
                    ...state,
                    details: {
                        ...state.details as Pick<SingleInvoiceState, keyof SingleInvoiceState>,
                        dirtyInvoice: {
                            tenantId: action.tenantId,
                            status: InvoiceStatus.Draft,
                            issueDate: moment.default().format('YYYY-MM-DD'),
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

            case ActionType.RESET_INVOICE_STORE_STATE:
                return unloadedState;
            /* END: Resets */

            default:
                return state;
        }
    }

    return state;
};
    