import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateRange } from '../../../../common/models';
import { EmployeeLite } from '../../employees/models';
import {
    TimeActivity,
    TimeActivityDetailsReport,
} from '../models';

/* BEGIN: REST API Actions */
interface RequestTimeActivityDetailsReportDataAction extends IAction {
    type: ActionType.REQUEST_TIME_ACTIVITY_DETAILS_REPORT;
}

interface ReceiveTimeActivityDetailsReportDataAction extends IAction {
    type: ActionType.RECEIVE_TIME_ACTIVITY_DETAILS_REPORT;
    data: TimeActivityDetailsReport;
}

interface SaveNewTimeActivityRequestActionAction extends IAction {
    type: ActionType.REQUEST_SAVE_NEW_TIME_ACTIVITY;
}

interface SaveNewTimeActivityResponseAction extends IAction {
    type: ActionType.NEW_TIME_ACTIVITY_SAVE_COMPLETED;
    savedTimeActivity: TimeActivity;
}

interface SaveUpdatedTimeActivityRequestAction extends IAction {
    type: ActionType.REQUEST_SAVE_UPDATED_TIME_ACTIVITY;
}

interface SaveUpdatedTimeActivityResponseAction extends IAction {
    type: ActionType.UPDATED_TIME_ACTIVITY_SAVE_COMPLETED;
    savedTimeActivity: TimeActivity;
}

interface SaveTimeActivityErrorAction extends IAction {
    type: ActionType.SAVE_TIME_ACTIVITY_ERROR;
}

interface DeleteTimeActivityRequestAction extends IAction {
    type: ActionType.REQUEST_DELETE_TIME_ACTIVITY;
}

interface DeleteTimeActivityReponseAction extends IAction {
    type: ActionType.DELETE_TIME_ACTIVITY_COMPLETED;
}

interface DeleteTimeActivityErrorAction extends IAction {
    type: ActionType.DELETE_TIME_ACTIVITY_ERROR;
}
/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
interface UpdateTimeActivityReportDateRangeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE;
    dateRange: DateRange;
}

interface UpdateTimeActivityReportDateRangeStartAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_START;
    dateRangeStart: string;
}

interface UpdateTimeActivityReportDateRangeEndAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_END;
    dateRangeEnd: string;
}

interface UpdateTimeActivityReportCustomerFilterAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_CUSTOMER_FILTER;
    customerNumber: string | null;
}

interface UpdateTimeActivityReportEmployeeFilterAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_EMPLOYEE_FILTER;
    employeeNumber: number | null;
}

interface UpdateTimeActivityCustomerAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_CUSTOMER;
    customerId: string | null; // GUID (required to create)
}

interface UpdateTimeActivityEmployeeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_EMPLOYEE;
    employeeId: string | null; // GUID (required to create)
}

interface UpdateTimeActivityProductAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_PRODUCT;
    productId: string | null; // GUID (required to create)
}

interface UpdateTimeActivityIsBillableAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_IS_BILLABLE;
    isBillable: boolean;
}

interface UpdateTimeActivityHourlyRateAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_HOURLY_RATE;
    hourlyRate: number | null;
    hourlyRateAsString: string | null;
}

interface UpdateTimeActivityTimeZoneAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_TIME_ZONE;
    timeZoneId: string | null; // IANA/Olson/TZDB Time Zone ID (required to create)
}

interface UpdateTimeActivityStartTimeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_START_TIME;
    startTime: string | null; // Time of day string in hh:mm:ss format (required to create)
}

interface UpdateTimeActivityEndTimeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_END_TIME;
    endTime: string | null; // Time of day string in hh:mm:ss format (required to create)
}

interface UpdateTimeActivityBreakTimeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_BREAK_TIME;
    breakTime: string | null; // Duration in hh:mm:ss format (optional)
}

interface UpdateTimeActivityDateAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DATE;
    date: string | null; // Date in YYYY-MM-DD format (required to create)
}

interface UpdateTimeActivityDescriptionAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DESCRIPTION;
    description: string | null;
}

interface InitializeNewTimeActivityAction extends IAction {
    type: ActionType.INITIALIZE_NEW_TIME_ACTIVITY;
    tenantId: string; // GUID
    employee: EmployeeLite | null;
}

interface SelectExistingTimeActivityAction extends IAction {
    type: ActionType.SELECT_EXISTING_TIME_ACTIVITY;
    selectedTimeActivity: TimeActivity;
}
/* END: UI Gesture Actions */

/* BEGIN: Resets */
interface ResetTimeActivityDetailsReportData extends IAction {
    type: ActionType.RESET_TIME_ACTIVITY_DETAILS_REPORT_DATA;
}

interface ResetDirtyTimeActivtyAction extends IAction {
    type: ActionType.RESET_DIRTY_TIME_ACTIVITY;
}

interface ResetTimeActivityStoreAction extends IAction {
    type: ActionType.RESET_TIME_ACTIVITY_STORE_STATE;
}
/* END: Resets */

export type KnownAction = RequestTimeActivityDetailsReportDataAction |
    ReceiveTimeActivityDetailsReportDataAction |
    SaveNewTimeActivityRequestActionAction |
    SaveNewTimeActivityResponseAction |
    SaveUpdatedTimeActivityRequestAction |
    SaveUpdatedTimeActivityResponseAction |
    SaveTimeActivityErrorAction |
    DeleteTimeActivityRequestAction |
    DeleteTimeActivityReponseAction |
    DeleteTimeActivityErrorAction |
    UpdateTimeActivityReportDateRangeAction |
    UpdateTimeActivityReportDateRangeStartAction |
    UpdateTimeActivityReportDateRangeEndAction |
    UpdateTimeActivityReportCustomerFilterAction |
    UpdateTimeActivityReportEmployeeFilterAction |
    UpdateTimeActivityBreakTimeAction |
    UpdateTimeActivityCustomerAction |
    UpdateTimeActivityDateAction |
    UpdateTimeActivityDescriptionAction |
    UpdateTimeActivityEmployeeAction |
    UpdateTimeActivityEndTimeAction |
    UpdateTimeActivityHourlyRateAction |
    UpdateTimeActivityIsBillableAction |
    UpdateTimeActivityProductAction |
    UpdateTimeActivityStartTimeAction |
    UpdateTimeActivityTimeZoneAction |
    InitializeNewTimeActivityAction |
    SelectExistingTimeActivityAction |
    ResetDirtyTimeActivtyAction |
    ResetTimeActivityDetailsReportData |
    ResetTimeActivityStoreAction;
