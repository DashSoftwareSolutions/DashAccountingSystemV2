import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    cloneDeep,
    filter,
    findIndex,
    groupBy,
    isEmpty,
    isNil,
    keys,
    map,
    reduce,
    trim,
} from 'lodash';
import { AppThunkAction } from './';
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
    isLoading: boolean;
    isSaving: boolean;
    isDeleting: boolean;
}

const DEFAULT_SINGLE_INVOICE_STATE: SingleInvoiceState = {
    isLoading: false,
    isSaving: false,
    isDeleting: false,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Invoice Store');

/* BEGIN: REST API Actions */
interface RequestInvoiceListAction extends IAction {
    type: ActionType.REQUEST_INVOICE_LIST;
}

interface ReceiveInvoiceListAction extends IAction {
    type: ActionType.RECEIVE_INVOICE_LIST;
    data: PagedResult<InvoiceLite>;
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
    InitializeNewInvoiceAction |
    ResetInvoiceListAction |
    ResetDirtyInvoiceAction |
    ResetInvoiceStoreAction;

export const actionCreators = {
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
            /* END: REST API Actions */

            /* BEGIN: UI Gesture Actions */
            /* END: UI Gesture Actions */

            /* BEGIN: Resets */
            case ActionType.RESET_INVOICE_STORE_STATE:
                return unloadedState;
            /* END: Resets */

            default:
                return state;
        }
    }

    return state;
};
    