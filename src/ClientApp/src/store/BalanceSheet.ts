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
import BalanceSheetReport from '../models/BalanceSheetReport';
import BalanceSheetReportAccount from '../models/BalanceSheetReportAccount';

export interface BalanceSheetState {
    reportData: BalanceSheetReport | null;
    isLoading: boolean;
    dateRangeStart: string;
    dateRangeEnd: string;
}

interface RequestBalanceSheetReportDataAction {
    type: 'REQUEST_BALANCE_SHEET_REPORT_DATA';
}

interface ReceiveBalanceSheetReportDataAction {
    type: 'RECEIVE_BALANCE_SHEET_REPORT_DATA';
    report: BalanceSheetReport;
}

interface UpdateBalanceSheetReportDateRangeStartAction {
    type: 'UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START';
    dateRangeStart: string;
}

interface UpdateBalanceSheetReportDateRangeEndAction {
    type: 'UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END';
    dateRangeEnd: string;
}

interface ResetBalanceSheetReportDataAction {
    type: 'RESET_BALANCE_SHEET_REPORT_DATA';
}

type KnownAction = RequestBalanceSheetReportDataAction |
    ReceiveBalanceSheetReportDataAction |
    UpdateBalanceSheetReportDateRangeStartAction |
    UpdateBalanceSheetReportDateRangeEndAction |
    ResetBalanceSheetReportDataAction;

const logger = new Logger('Balance Sheet Store');

export const actionCreators = {
    requestBalanceSheetReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.balanceSheet) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.balanceSheet.isLoading &&
            isNil(appState.balanceSheet.reportData)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;
            const dateRangeStart = appState.balanceSheet.dateRangeStart;
            const dateRangeEnd = appState.balanceSheet.dateRangeEnd;

            fetch(`api/ledger/${tenantId}/balance-sheet?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response);
                        return null;
                    }

                    return response.json() as Promise<BalanceSheetReport>
                })
                .then((report) => {
                    if (!isNil(report)) {
                        dispatch({ type: 'RECEIVE_BALANCE_SHEET_REPORT_DATA', report });
                    }
                });

            dispatch({ type: 'REQUEST_BALANCE_SHEET_REPORT_DATA' });
        }
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START', dateRangeStart });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END', dateRangeEnd });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'RESET_BALANCE_SHEET_REPORT_DATA' });
    },
};

const unloadedState: BalanceSheetState = {
    isLoading: false,
    // TODO: update default date range logic (e.g. current quarter to date, etc.)
    dateRangeStart: '2018-01-01',
    dateRangeEnd: moment().format('YYYY-MM-DD'),
    reportData: null,
};

export const reducer: Reducer<BalanceSheetState> = (state: BalanceSheetState | undefined, incomingAction: Action): BalanceSheetState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case 'REQUEST_BALANCE_SHEET_REPORT_DATA':
                return {
                    ...state,
                    isLoading: true,
                };

            case 'RECEIVE_BALANCE_SHEET_REPORT_DATA':
                return {
                    ...state,
                    isLoading: false,
                    reportData: action.report,
                };

            case 'UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START':
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
                };

            case 'UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END':
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case 'RESET_BALANCE_SHEET_REPORT_DATA':
                return {
                    ...state,
                    isLoading: false,
                    reportData: null,
                };
        }
    }

    return state;
}