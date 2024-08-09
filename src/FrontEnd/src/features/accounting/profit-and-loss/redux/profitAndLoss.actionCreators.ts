import { isNil } from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './profitAndLoss.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    DateRange,
    ExportDownloadInfo,
    ExportFormat,
} from '../../../../common/models';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { ProfitAndLossReport } from '../models';

const actionCreators = {
    requestProfitAndLossReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.profitAndLoss) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.profitAndLoss.isFetching &&
            isNil(appState.profitAndLoss.reportData)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;
            const dateRangeStart = appState.profitAndLoss.dateRangeStart;
            const dateRangeEnd = appState.profitAndLoss.dateRangeEnd;

            fetch(`/api/ledger/${tenantId}/profit-and-loss?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<ProfitAndLossReport>
                })
                .then((report) => {
                    if (!isNil(report)) {
                        dispatch({
                            type: ActionType.RECEIVE_PROFIT_AND_LOSS_REPORT_DATA,
                            report,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_PROFIT_AND_LOSS_REPORT_DATA });
        }
    },

    requestProfitAndLossReportExcelExport: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.profitAndLoss) &&
            !isNil(appState?.exportDownload) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.exportDownload.isFetching) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;
            const dateRangeStart = appState.profitAndLoss.dateRangeStart;
            const dateRangeEnd = appState.profitAndLoss.dateRangeEnd;

            const exportRequestParameters = {
                tenantId,
                dateRangeStart,
                dateRangeEnd,
                exportType: 'ProfitAndLossReport',
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

            fetch('/api/ledger/export-profit-and-loss', requestOptions)
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
            type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE,
            dateRange,
        })
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_START,
            dateRangeStart,
        });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_END,
            dateRangeEnd,
        });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_PROFIT_AND_LOSS_REPORT_DATA });
    },
};

export default actionCreators;
