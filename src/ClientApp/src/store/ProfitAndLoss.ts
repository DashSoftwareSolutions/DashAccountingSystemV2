﻿import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {
    isNil,
} from 'lodash';
import moment from 'moment-timezone';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import IAction from './IAction';
import ProfitAndLossReport from '../models/ProfitAndLossReport';

export interface ProfitAndLossState {
    reportData: ProfitAndLossReport | null;
    isLoading: boolean;
    dateRangeStart: string;
    dateRangeEnd: string;
}

interface RequestProfitAndLossReportDataAction extends IAction {
    type: ActionType.REQUEST_PROFIT_AND_LOSS_REPORT_DATA;
}

interface ReceiveProfitAndLossReportDataAction extends IAction {
    type: ActionType.RECEIVE_PROFIT_AND_LOSS_REPORT_DATA;
    report: ProfitAndLossReport;
}

interface UpdateProfitAndLossReportDateRangeStartAction extends IAction {
    type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_START;
    dateRangeStart: string;
}

interface UpdateProfitAndLossReportDateRangeEndAction extends IAction {
    type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_END;
    dateRangeEnd: string;
}

interface ResetProfitAndLossReportDataAction extends IAction {
    type: ActionType.RESET_PROFIT_AND_LOSS_REPORT_DATA;
}

type KnownAction = RequestProfitAndLossReportDataAction |
    ReceiveProfitAndLossReportDataAction |
    UpdateProfitAndLossReportDateRangeStartAction |
    UpdateProfitAndLossReportDateRangeEndAction |
    ResetProfitAndLossReportDataAction;

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Profit And Loss Store');

export const actionCreators = {
    requestProfitAndLossReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.profitAndLoss) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.profitAndLoss.isLoading &&
            isNil(appState.profitAndLoss.reportData)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;
            const dateRangeStart = appState.profitAndLoss.dateRangeStart;
            const dateRangeEnd = appState.profitAndLoss.dateRangeEnd;

            fetch(`api/ledger/${tenantId}/profit-and-loss?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response);
                        return null;
                    }

                    return response.json() as Promise<ProfitAndLossReport>
                })
                .then((report) => {
                    if (!isNil(report)) {
                        dispatch({ type: ActionType.RECEIVE_PROFIT_AND_LOSS_REPORT_DATA, report });
                    }
                });

            dispatch({ type: ActionType.REQUEST_PROFIT_AND_LOSS_REPORT_DATA });
        }
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_START, dateRangeStart });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_END, dateRangeEnd });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_PROFIT_AND_LOSS_REPORT_DATA });
    },
};

const unloadedState: ProfitAndLossState = {
    isLoading: false,
    // TODO: update default date range logic (e.g. current quarter to date, etc.)
    dateRangeStart: '2018-01-01',
    dateRangeEnd: moment().format('YYYY-MM-DD'),
    reportData: null,
};

export const reducer: Reducer<ProfitAndLossState> = (state: ProfitAndLossState | undefined, incomingAction: Action): ProfitAndLossState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_PROFIT_AND_LOSS_REPORT_DATA:
                return {
                    ...state,
                    isLoading: true,
                };

            case ActionType.RECEIVE_PROFIT_AND_LOSS_REPORT_DATA:
                return {
                    ...state,
                    isLoading: false,
                    reportData: action.report,
                };

            case ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_START:
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
                };

            case ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_END:
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case ActionType.RESET_PROFIT_AND_LOSS_REPORT_DATA:
                return {
                    ...state,
                    isLoading: false,
                    reportData: null,
                };
        }
    }

    return state;
}