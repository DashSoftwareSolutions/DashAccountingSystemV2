import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {
    isEmpty,
    isNil,
} from 'lodash';
import moment from 'moment-timezone';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import LedgerAccount from '../models/LedgerAccount';
import IAction from './IAction';

export interface LedgerState {
    accounts: LedgerAccount[];
    isLoading: boolean;
    dateRangeStart: string;
    dateRangeEnd: string;
}

interface RequestLedgerReportDataAction extends IAction {
    type: ActionType.REQUEST_LEDGER_REPORT_DATA;
}

interface ReceiveLedgerReportDataAction extends IAction {
    type: ActionType.RECEIVE_LEDGER_REPORT_DATA;
    accounts: LedgerAccount[];
}

interface UpdateLedgerReportDateRangeStartAction extends IAction {
    type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_START;
    dateRangeStart: string;
}

interface UpdateLedgerReportDateRangeEndAction extends IAction {
    type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_END;
    dateRangeEnd: string;
}

interface ResetLedgerReportDataAction extends IAction {
    type: ActionType.RESET_LEDGER_REPORT_DATA;
}

type KnownAction = RequestLedgerReportDataAction |
    ReceiveLedgerReportDataAction |
    UpdateLedgerReportDateRangeStartAction |
    UpdateLedgerReportDateRangeEndAction |
    ResetLedgerReportDataAction;

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Ledger Store');

export const actionCreators = {
    requestLedgerReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.ledger) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.ledger.isLoading &&
            isEmpty(appState.ledger.accounts)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;
            const dateRangeStart = appState.ledger.dateRangeStart;
            const dateRangeEnd = appState.ledger.dateRangeEnd;

            fetch(`api/ledger/${tenantId}/report?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response);
                        return null;
                    }

                    return response.json() as Promise<LedgerAccount[]>
                })
                .then((accounts) => {
                    if (!isNil(accounts)) {
                        dispatch({ type: ActionType.RECEIVE_LEDGER_REPORT_DATA, accounts });
                    }
                });

            dispatch({ type: ActionType.REQUEST_LEDGER_REPORT_DATA });
        }
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_START, dateRangeStart });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction < KnownAction > => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_END, dateRangeEnd });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_LEDGER_REPORT_DATA });
    },
};

const unloadedState: LedgerState = {
    accounts: [],
    isLoading: false,
    // TODO: update default date range logic (e.g. current quarter to date, etc.)
    dateRangeStart: '2018-01-01',
    dateRangeEnd: moment().format('YYYY-MM-DD'),
};

export const reducer: Reducer<LedgerState> = (state: LedgerState | undefined, incomingAction: Action): LedgerState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_LEDGER_REPORT_DATA:
                return {
                    ...state,
                    isLoading: true,
                };

            case ActionType.RECEIVE_LEDGER_REPORT_DATA:
                return {
                    ...state,
                    isLoading: false,
                    accounts: action.accounts,
                };

            case ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_START:
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
                };

            case ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_END:
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case ActionType.RESET_LEDGER_REPORT_DATA:
                return {
                    ...state,
                    isLoading: false,
                    accounts: [],
                };
        }
    }

    return state;
}

