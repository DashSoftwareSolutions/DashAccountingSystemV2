import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {
    isNil,
} from 'lodash';
import moment from 'moment-timezone';
import { Logger } from '../common/Logging';
import {
    RequestDownloadAction,
    ReceiveDownloadErrorAction,
    ReceiveDownloadInfoAction,
} from './Export';
import ActionType from './ActionType';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import BalanceSheetReport from '../models/BalanceSheetReport';
import ExportFormat from '../models/ExportFormat';
import ApiErrorResponse from '../models/ApiErrorResponse';
import ExportDownloadInfo from '../models/ExportDownloadInfo';
import IAction from './IAction';

export interface BalanceSheetState {
    reportData: BalanceSheetReport | null;
    isLoading: boolean;
    dateRangeStart: string;
    dateRangeEnd: string;
}

interface RequestBalanceSheetReportDataAction extends IAction {
    type: ActionType.REQUEST_BALANCE_SHEET_REPORT_DATA;
}

interface ReceiveBalanceSheetReportDataAction extends IAction {
    type: ActionType.RECEIVE_BALANCE_SHEET_REPORT_DATA;
    report: BalanceSheetReport;
}

interface UpdateBalanceSheetReportDateRangeStartAction extends IAction {
    type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START;
    dateRangeStart: string;
}

interface UpdateBalanceSheetReportDateRangeEndAction extends IAction {
    type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END;
    dateRangeEnd: string;
}

interface ResetBalanceSheetReportDataAction extends IAction {
    type: ActionType.RESET_BALANCE_SHEET_REPORT_DATA;
}

type KnownAction = RequestBalanceSheetReportDataAction |
    ReceiveBalanceSheetReportDataAction |
    UpdateBalanceSheetReportDateRangeStartAction |
    UpdateBalanceSheetReportDateRangeEndAction |
    ResetBalanceSheetReportDataAction |
    RequestDownloadAction |
    ReceiveDownloadErrorAction |
    ReceiveDownloadInfoAction;

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                        dispatch({ type: ActionType.RECEIVE_BALANCE_SHEET_REPORT_DATA, report });
                    }
                });

            dispatch({ type: ActionType.REQUEST_BALANCE_SHEET_REPORT_DATA });
        }
    },

    requestBalanceSheetReportExcelExport: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.balanceSheet) &&
            !isNil(appState?.exportDownload) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.exportDownload.isLoading) {
            const tenantId = appState?.tenants?.selectedTenant?.id;
            const dateRangeStart = appState.balanceSheet.dateRangeStart;
            const dateRangeEnd = appState.balanceSheet.dateRangeEnd;

            const exportRequestParameters = {
                tenantId,
                dateRangeStart,
                dateRangeEnd,
                exportType: 'BalanceSheetReport',
                exportFormat: ExportFormat.XLSX,
            };

            const accessToken = await authService.getAccessToken();

            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(exportRequestParameters),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            fetch('api/ledger/export-balance-sheet', requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        try {
                            response
                                .json()
                                .then((apiErrorResponse: ApiErrorResponse) => {
                                    dispatch({ type: ActionType.RECEIVE_EXPORT_DOWNLOAD_ERROR, error: apiErrorResponse.error })
                                });
                        } catch (error) {
                            logger.error('Secondary error parsing error response from Balance Sheet Export request:', error);
                        }

                        return null;
                    }

                    return response.json() as Promise<ExportDownloadInfo>
                })
                .then((downloadInfo) => {
                    if (!isNil(downloadInfo)) {
                        dispatch({ type: ActionType.RECEIVE_EXPORT_DOWNLOAD_INFO, downloadInfo });
                    }
                });

            dispatch({ type: ActionType.REQUEST_EXPORT_DOWNLOAD });
        }
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START, dateRangeStart });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END, dateRangeEnd });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_BALANCE_SHEET_REPORT_DATA });
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
            case ActionType.REQUEST_BALANCE_SHEET_REPORT_DATA:
                return {
                    ...state,
                    isLoading: true,
                };

            case ActionType.RECEIVE_BALANCE_SHEET_REPORT_DATA:
                return {
                    ...state,
                    isLoading: false,
                    reportData: action.report,
                };

            case ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START:
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
                };

            case ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END:
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case ActionType.RESET_BALANCE_SHEET_REPORT_DATA:
                return {
                    ...state,
                    isLoading: false,
                    reportData: null,
                };

            default:
                return state;
        }
    }

    return state;
}