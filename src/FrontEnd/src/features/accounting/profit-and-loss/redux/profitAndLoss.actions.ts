import {
    RequestDownloadAction,
    ReceiveDownloadErrorAction,
    ReceiveDownloadInfoAction,
} from '../../../../app/export/export.actions';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateRange } from '../../../../common/models';
import { ProfitAndLossReport } from '../models';

export interface RequestProfitAndLossReportDataAction extends IAction {
    type: ActionType.REQUEST_PROFIT_AND_LOSS_REPORT_DATA;
}

export interface ReceiveProfitAndLossReportDataAction extends IAction {
    type: ActionType.RECEIVE_PROFIT_AND_LOSS_REPORT_DATA;
    report: ProfitAndLossReport;
}

export interface UpdateProfitAndLossReportDateRangeAction extends IAction {
    type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE;
    dateRange: DateRange;
}

export interface UpdateProfitAndLossReportDateRangeStartAction extends IAction {
    type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_START;
    dateRangeStart: string;
}

export interface UpdateProfitAndLossReportDateRangeEndAction extends IAction {
    type: ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_END;
    dateRangeEnd: string;
}

export interface ResetProfitAndLossReportDataAction extends IAction {
    type: ActionType.RESET_PROFIT_AND_LOSS_REPORT_DATA;
}

export type KnownAction = RequestProfitAndLossReportDataAction |
    ReceiveProfitAndLossReportDataAction |
    UpdateProfitAndLossReportDateRangeAction |
    UpdateProfitAndLossReportDateRangeStartAction |
    UpdateProfitAndLossReportDateRangeEndAction |
    ResetProfitAndLossReportDataAction |
    RequestDownloadAction |
    ReceiveDownloadErrorAction |
    ReceiveDownloadInfoAction;
