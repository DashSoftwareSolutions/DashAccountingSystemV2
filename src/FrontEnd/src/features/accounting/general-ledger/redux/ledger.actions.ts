import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateRange } from '../../../../common/models';
import { LedgerAccount } from '../models';

export interface RequestLedgerReportDataAction extends IAction {
    type: ActionType.REQUEST_LEDGER_REPORT_DATA;
}

export interface ReceiveLedgerReportDataAction extends IAction {
    type: ActionType.RECEIVE_LEDGER_REPORT_DATA;
    accounts: LedgerAccount[];
}

export interface UpdateLedgerReportDateRangeAction extends IAction {
    type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE;
    dateRange: DateRange;
}

export interface UpdateLedgerReportDateRangeStartAction extends IAction {
    type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_START;
    dateRangeStart: string;
}

export interface UpdateLedgerReportDateRangeEndAction extends IAction {
    type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_END;
    dateRangeEnd: string;
}

export interface ResetLedgerReportDataAction extends IAction {
    type: ActionType.RESET_LEDGER_REPORT_DATA;
}

export type KnownAction = RequestLedgerReportDataAction |
    ReceiveLedgerReportDataAction |
    UpdateLedgerReportDateRangeAction |
    UpdateLedgerReportDateRangeStartAction |
    UpdateLedgerReportDateRangeEndAction |
    ResetLedgerReportDataAction;
