import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    isEmpty,
    isNil,
} from 'lodash';
import { AppThunkAction } from './';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import IAction from './IAction';
import TimeActivity from '../models/TimeActivity';
import TimeActivityDetailsReport from '../models/TimeActivityDetailsReport';

// TODO: May need to track validation state for ceating/updating a Time Activity

export interface TimeActivityStoreState {
    dateRangeStart: string;
    dateRangeEnd: string;
    detailsReportData: TimeActivityDetailsReport | null;
    dirtyTimeActivity: TimeActivity | null;
    existingTimeActivity: TimeActivity | null;
    filterByCustomerNumber: string | null; // Customer Numbers are alpha numeric / TODO: might someday allow multiple
    filterByEmployeeNumber: number | null; // Employee Numbers are UINTs / TODO: might someday allow multiple
    isLoading: boolean;
    isSaving: boolean;
    isDeleting: boolean;
}

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
    type: ActionType.SAVE_NEW_TIME_ACTIVITY_COMPLETED;
    savedTimeActivity: TimeActivity;
}

interface SaveUpdatedTimeActivityRequestAction extends IAction {
    type: ActionType.REQUEST_SAVE_UPDATED_TIME_ACTIVITY;
}

interface SaveUpdatedTimeActivityResponseAction extends IAction {
    type: ActionType.SAVE_UPDATED_TIME_ACTIVITY_COMPLETED;
    savedTimeActivity: TimeActivity;
}

interface DeleteTimeActivityRequestAction extends IAction {
    type: ActionType.REQUEST_DELETE_TIME_ACTIVITY;
}

interface DeleteTimeActivityReponseAction extends IAction {
    type: ActionType.DELETE_TIME_ACTIVITY_COMPLETED;
}
/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
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
    customerId: string | null;
}

interface UpdateTimeActivityEmployeeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_EMPLOYEE;
    employeeId: string | null;
}

interface UpdateTimeActivityProductAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_PRODUCT;
    productId: string | null;
}

interface UpdateTimeActivityIsBillableAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_IS_BILLABLE;
    isBillable: boolean;
}

interface UpdateTimeActivityHourlyRateAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_HOURLY_RATE;
    hourlyRate: number | null;
    hourRateAsString: string | null;
}

interface UpdateTimeActivityTimeZoneAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_TIME_ZONE;
    timeZoneId: string | null;
}

interface UpdateTimeActivityStartTimeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_START_TIME;
    startTime: string | null;
}

interface UpdateTimeActivityEndTimeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_END_TIME;
    endTime: string | null;
}

interface UpdateTimeActivityBreakTimeAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_BREAK_TIME;
    breakTime: string | null;
}

interface UpdateTimeActivityDescriptionAction extends IAction {
    type: ActionType.UPDATE_TIME_ACTIVITY_DESCRIPTION;
    description: string | null;
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

type KnownAction = RequestTimeActivityDetailsReportDataAction |
    ReceiveTimeActivityDetailsReportDataAction |
    SaveNewTimeActivityRequestActionAction |
    SaveNewTimeActivityResponseAction |
    SaveUpdatedTimeActivityRequestAction |
    SaveUpdatedTimeActivityResponseAction |
    DeleteTimeActivityRequestAction |
    DeleteTimeActivityReponseAction |
    UpdateTimeActivityReportDateRangeStartAction |
    UpdateTimeActivityReportDateRangeEndAction |
    UpdateTimeActivityReportCustomerFilterAction |
    UpdateTimeActivityReportEmployeeFilterAction |
    UpdateTimeActivityBreakTimeAction |
    UpdateTimeActivityCustomerAction |
    UpdateTimeActivityDescriptionAction |
    UpdateTimeActivityEmployeeAction |
    UpdateTimeActivityEndTimeAction |
    UpdateTimeActivityHourlyRateAction |
    UpdateTimeActivityIsBillableAction |
    UpdateTimeActivityProductAction |
    UpdateTimeActivityStartTimeAction |
    UpdateTimeActivityTimeZoneAction |
    SelectExistingTimeActivityAction |
    ResetDirtyTimeActivtyAction |
    ResetTimeActivityDetailsReportData |
    ResetTimeActivityStoreAction;

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Time Activity Store');

export const actionCreators = {
    requestTimeActivityDetailsReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.timeActivity) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.timeActivity.isLoading &&
            isEmpty(appState.timeActivity?.detailsReportData)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;

            const {
                dateRangeStart,
                dateRangeEnd,
                filterByCustomerNumber,
                filterByEmployeeNumber,
            } = appState.timeActivity;

            let reportRequestUrl = `api/time-tracking/${tenantId}/time-activities-report?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`;

            if (!isNil(filterByCustomerNumber)) {
                reportRequestUrl += `&customers=${filterByCustomerNumber}`;
            }

            if (!isNil(filterByEmployeeNumber)) {
                reportRequestUrl += `&employees=${filterByEmployeeNumber}`;
            }

            fetch(reportRequestUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<TimeActivityDetailsReport>
                })
                .then((data) => {
                    if (!isNil(data)) {
                        dispatch({ type: ActionType.RECEIVE_TIME_ACTIVITY_DETAILS_REPORT, data });
                    }
                });

            dispatch({ type: ActionType.REQUEST_TIME_ACTIVITY_DETAILS_REPORT });
        }
    },

    selectTimeActivity: (selectedTimeActivity: TimeActivity): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.SELECT_EXISTING_TIME_ACTIVITY, selectedTimeActivity });
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_START, dateRangeStart });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_END, dateRangeEnd });
    },

    updateCustomerFilter: (customerNumber: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_CUSTOMER_FILTER, customerNumber });
    },

    updateEmployeeFilter: (employeeNumber: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_EMPLOYEE_FILTER, employeeNumber });
    },

    resetTimeActivityDetailsReportData: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_TIME_ACTIVITY_DETAILS_REPORT_DATA });
    },
};

const unloadedState: TimeActivityStoreState = {
    // TODO: Different defaults for the dates
    dateRangeStart: '2021-07-01',
    dateRangeEnd: '2021-07-31',
    detailsReportData: null,
    dirtyTimeActivity: null,
    existingTimeActivity: null,
    filterByCustomerNumber: null,
    filterByEmployeeNumber: null,
    isLoading: false,
    isSaving: false,
    isDeleting: false,
};

export const reducer: Reducer<TimeActivityStoreState> = (state: TimeActivityStoreState | undefined, incomingAction: Action): TimeActivityStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_TIME_ACTIVITY_DETAILS_REPORT:
                return {
                    ...state,
                    isLoading: true,
                };

            case ActionType.RECEIVE_TIME_ACTIVITY_DETAILS_REPORT:
                return {
                    ...state,
                    isLoading: false,
                    detailsReportData: action.data,
                };

            case ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_CUSTOMER_FILTER:
                return {
                    ...state,
                    filterByCustomerNumber: action.customerNumber,
                };

            case ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_EMPLOYEE_FILTER:
                return {
                    ...state,
                    filterByEmployeeNumber: action.employeeNumber,
                };

            case ActionType.RESET_TIME_ACTIVITY_DETAILS_REPORT_DATA:
                return {
                    ...state,
                    isLoading: false,
                    detailsReportData: null,
                };
        }
    }

    return state;
}