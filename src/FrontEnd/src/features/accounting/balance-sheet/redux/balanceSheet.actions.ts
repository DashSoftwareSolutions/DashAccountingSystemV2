import {
    RequestDownloadAction,
    ReceiveDownloadErrorAction,
    ReceiveDownloadInfoAction,
} from '../../../../app/export/export.actions';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateRange } from '../../../../common/models';
import { BalanceSheetReport } from '../models';

interface RequestBalanceSheetReportDataAction extends IAction {
    type: ActionType.REQUEST_BALANCE_SHEET_REPORT_DATA;
}

interface ReceiveBalanceSheetReportDataAction extends IAction {
    type: ActionType.RECEIVE_BALANCE_SHEET_REPORT_DATA;
    report: BalanceSheetReport;
}

interface UpdateBalanceSheetReportDateRangeAction extends IAction {
    type: ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE;
    dateRange: DateRange;
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

export type KnownAction = RequestBalanceSheetReportDataAction |
    ReceiveBalanceSheetReportDataAction |
    UpdateBalanceSheetReportDateRangeAction |
    UpdateBalanceSheetReportDateRangeStartAction |
    UpdateBalanceSheetReportDateRangeEndAction |
    ResetBalanceSheetReportDataAction |
    RequestDownloadAction |
    ReceiveDownloadErrorAction |
    ReceiveDownloadInfoAction;
