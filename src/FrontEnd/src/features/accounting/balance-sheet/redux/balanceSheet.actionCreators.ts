import { isNil } from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './balanceSheet.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    DateRange,
    ExportDownloadInfo,
    ExportFormat,
} from '../../../../common/models';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { BalanceSheetReport } from '../models';

const actionCreators = {
    requestBalanceSheetReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.balanceSheet) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.balanceSheet.isFetching &&
            isNil(appState.balanceSheet.reportData)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;
            const dateRangeStart = appState.balanceSheet.dateRangeStart;
            const dateRangeEnd = appState.balanceSheet.dateRangeEnd;

            fetch(`/api/ledger/${tenantId}/balance-sheet?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<BalanceSheetReport>
                })
                .then((report) => {
                    if (!isNil(report)) {
                        dispatch({
                            type: ActionType.RECEIVE_BALANCE_SHEET_REPORT_DATA,
                            report,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_BALANCE_SHEET_REPORT_DATA });
        }
    },

    requestBalanceSheetReportExcelExport: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.balanceSheet) &&
            !isNil(appState?.exportDownload) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.exportDownload.isFetching) {
            const tenantId = appState?.application?.selectedTenant?.id;
            const accessToken = appState.authentication.tokens?.accessToken;
            const dateRangeStart = appState.balanceSheet.dateRangeStart;
            const dateRangeEnd = appState.balanceSheet.dateRangeEnd;

            const exportRequestParameters = {
                tenantId,
                dateRangeStart,
                dateRangeEnd,
                exportType: 'BalanceSheetReport',
                exportFormat: ExportFormat.XLSX,
            };

            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(exportRequestParameters),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            fetch('/api/ledger/export-balance-sheet', requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<ExportDownloadInfo>;
                })
                .then((downloadInfo) => {
                    if (!isNil(downloadInfo)) {
                        dispatch({
                            type: ActionType.RECEIVE_EXPORT_DOWNLOAD_INFO,
                            downloadInfo,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_EXPORT_DOWNLOAD });
        }
    },

    updateDateRange: (dateRange: DateRange): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE,
            dateRange,
        });
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START,
            dateRangeStart,
        });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END,
            dateRangeEnd,
        });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_BALANCE_SHEET_REPORT_DATA });
    },
};

export default actionCreators;
