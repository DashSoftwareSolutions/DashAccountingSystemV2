import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    cloneDeep,
    find,
    isEmpty,
    isNil,
} from 'lodash';
import moment, { Duration } from 'moment-timezone';
import { AppThunkAction } from './';
import { formatWithTwoDecimalPlaces } from '../common/StringUtils';
import { Logger } from '../common/Logging';
import { numbersAreEqualWithPrecision } from '../common/NumericUtils';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import IAction from './IAction';
import TimeActivity from '../models/TimeActivity';
import TimeActivityDetailsReport from '../models/TimeActivityDetailsReport';
import EmployeeLite from '../models/EmployeeLite';

export interface TimeActivityDurationValidationState {
    message: string;
    hasDate: boolean;
    hasStartTime: boolean;
    hasEndTime: boolean;
    hasBreakTime: boolean;
    hasTimeZone: boolean;
    isBillable: boolean;
    hourlyRate: number | null;
    isStartTimeAfterEndTime: boolean;
    isValid: boolean;
    doesBreakTimeExceedWorkingTime: boolean;
    workTimeDuration: Duration | null;
    breakTimeDuration: Duration | null;
    netDuration: Duration | null;
    billableAmount: number | null;
}

export interface TimeActivityAttributeValidationState {
    valid: boolean | undefined;
    invalid: boolean | undefined;
    error: string | null;
}

export interface TimeActivityValidationState {
    attributes: Map<string, TimeActivityAttributeValidationState>;
    duration: TimeActivityDurationValidationState;
    canSave: boolean;
}

const DEFAULT_ATTRIBUTE_VALIDATION_STATE: TimeActivityAttributeValidationState = {
    error: null,
    valid: undefined,
    invalid: undefined,
};

const DEFAULT_DURATION_VALIDATION_STATE: TimeActivityDurationValidationState = {
    message: '',
    hasDate: false,
    hasStartTime: false,
    hasEndTime: false,
    hasBreakTime: false,
    hasTimeZone: false,
    isBillable: false,
    hourlyRate: null,
    isStartTimeAfterEndTime: false,
    isValid: false,
    doesBreakTimeExceedWorkingTime: false,
    workTimeDuration: null,
    breakTimeDuration: null,
    netDuration: null,
    billableAmount: null,
};

const DEFAULT_VALIDATION_STATE: TimeActivityValidationState = {
    attributes: new Map([
        ['customerId', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['employeeId', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['productId', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['timeZone', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['date', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['startTime', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['endTime', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['description', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
    ]),
    duration: { ...DEFAULT_DURATION_VALIDATION_STATE },
    canSave: false,
};

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
    validation: TimeActivityValidationState;
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

type KnownAction = RequestTimeActivityDetailsReportDataAction |
    ReceiveTimeActivityDetailsReportDataAction |
    SaveNewTimeActivityRequestActionAction |
    SaveNewTimeActivityResponseAction |
    SaveUpdatedTimeActivityRequestAction |
    SaveUpdatedTimeActivityResponseAction |
    SaveTimeActivityErrorAction |
    DeleteTimeActivityRequestAction |
    DeleteTimeActivityReponseAction |
    DeleteTimeActivityErrorAction |
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

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Time Activity Store');

export const actionCreators = {
    /* BEGIN: REST API Actions */
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

    saveNewTimeActivity: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const timeActivityToSave = appState.timeActivity?.dirtyTimeActivity;

        if (isNil(timeActivityToSave)) {
            logger.warn('No Journal Entry found in store state.  Bailing out.');
            return;
        }

        const accessToken = await authService.getAccessToken();

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(timeActivityToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('api/time-tracking/time-activity', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler
                        .handleError(response, dispatch as Dispatch<IAction>)
                        .then(() => { dispatch({ type: ActionType.SAVE_TIME_ACTIVITY_ERROR }); });

                    return null;
                }

                return response.json() as Promise<TimeActivity>;
            })
            .then((savedTimeActivity) => {
                if (!isNil(savedTimeActivity)) {
                    dispatch({ type: ActionType.NEW_TIME_ACTIVITY_SAVE_COMPLETED, savedTimeActivity });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_TIME_ACTIVITY });
    },

    updateTimeActivity: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        // TODO: Implement me
    },

    deleteTimeActivity: (timeActivityId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        // TODO: Implement me
    },
    /* END: REST API Actions */

    /* BEGIN: Initialize New/Select Existing Time Activity to View/Manage */
    initializeNewTimeActivity: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState?.tenants?.selectedTenant?.id;
        const user = await authService.getUser();

        logger.info('User:', user);

        const employees = appState?.employees?.employees;
        logger.info('Employees:', employees);

        const currentUserEmployee = find(employees, (e) => e.isUser && e.userId === user.sub);
        logger.info('Current User Employee:', currentUserEmployee);

        if (isNil(tenantId)) {
            logger.warn('No selected Tenant.  Cannot create new Time Activity.');
            return;
        }

        dispatch({
            type: ActionType.INITIALIZE_NEW_TIME_ACTIVITY,
            employee: currentUserEmployee ?? null,
            tenantId,
        });
    },

    selectTimeActivity: (selectedTimeActivity: TimeActivity): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.SELECT_EXISTING_TIME_ACTIVITY, selectedTimeActivity });
    },
    /* END: Initialize New/Select Existing Time Activity to View/Manage */

    /* BEGIN: UI Gesture Actions for Time Activity Details Report/Listing Page */
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
    /* END: UI Gesture Actions for Time Activity Details Report/Listing Page */

    /* BEGIN: UI Gesture Actions for single Time Activity Entry Modal Dialog */
    updateBreakTime: (breakTime: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_BREAK_TIME, breakTime });
    },

    updateCustomer: (customerId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_CUSTOMER, customerId });
    },

    updateDate: (date: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_DATE, date });
    },

    updateDescription: (description: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_DESCRIPTION, description });
    },

    updateEmployee: (employeeId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_EMPLOYEE, employeeId });
    },

    updateEndTime: (endTime: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_END_TIME, endTime });
    },

    updateHourlyRate: (hourlyRate: number | null, hourlyRateAsString: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_HOURLY_RATE, hourlyRate, hourlyRateAsString });
    },

    updateIsBillable: (isBillable: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_IS_BILLABLE, isBillable });
    },

    updateProduct: (productId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_PRODUCT, productId });
    },

    updateStartTime: (startTime: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_START_TIME, startTime });
    },

    updateTimeZone: (timeZoneId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_TIME_ACTIVITY_TIME_ZONE, timeZoneId });
    },
    /* END: UI Gesture Actions for single Time Activity Entry Modal Dialog */

    /* BEGIN: Resets */
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_TIME_ACTIVITY_STORE_STATE });
    },

    resetDirtyTimeActivity: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_DIRTY_TIME_ACTIVITY });
    },
    /* END: Resets */
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
    validation: { ...DEFAULT_VALIDATION_STATE },
};

const updateTimeActivityDurationState = (state: TimeActivityStoreState, updatedDirtyTimeActivity: TimeActivity): TimeActivityStoreState => {
    const {
        validation: {
            duration: durationValidationState,
        },
    } = state;

    const updatedDurationValidationState = { ...durationValidationState };

    updatedDurationValidationState.hasDate = !isEmpty(updatedDirtyTimeActivity.date);
    updatedDurationValidationState.hasStartTime = !isEmpty(updatedDirtyTimeActivity.startTime);
    updatedDurationValidationState.hasEndTime = !isEmpty(updatedDirtyTimeActivity.endTime);
    updatedDurationValidationState.hasTimeZone = !isEmpty(updatedDirtyTimeActivity.timeZone);
    updatedDurationValidationState.isBillable = updatedDirtyTimeActivity.isBillable;
    updatedDurationValidationState.hourlyRate = updatedDirtyTimeActivity.hourlyBillingRate;

    if (updatedDurationValidationState.hasDate &&
        updatedDurationValidationState.hasStartTime &&
        updatedDurationValidationState.hasEndTime &&
        updatedDurationValidationState.hasTimeZone) {
        const startDateTime = moment.tz(`${updatedDirtyTimeActivity.date} ${updatedDirtyTimeActivity.startTime}`, updatedDirtyTimeActivity.timeZone);
        const endDateTime = moment.tz(`${updatedDirtyTimeActivity.date} ${updatedDirtyTimeActivity.endTime}`, updatedDirtyTimeActivity.timeZone);

        if (startDateTime.isSame(endDateTime)) {
            updatedDurationValidationState.message = 'Start time and end time are the same.  Zero time worked.';
        } else if (startDateTime.isAfter(endDateTime)) {
            updatedDurationValidationState.message = 'Start time is after end time.';
        } else {
            updatedDurationValidationState.workTimeDuration = moment.duration(endDateTime.diff(startDateTime));

            if (!isEmpty(updatedDirtyTimeActivity.break)) {
                updatedDurationValidationState.breakTimeDuration = moment.duration(`${updatedDirtyTimeActivity.break}:00`);

                if (updatedDurationValidationState.breakTimeDuration > updatedDurationValidationState.workTimeDuration) {
                    updatedDurationValidationState.message = 'The break time cannot exceed the total time worked. Please correct.';
                } else {
                    updatedDurationValidationState.netDuration = updatedDurationValidationState.workTimeDuration.subtract(updatedDurationValidationState.breakTimeDuration);
                }
            } else {
                updatedDurationValidationState.netDuration = updatedDurationValidationState.workTimeDuration.clone();
            }

            if (updatedDurationValidationState.isBillable &&
                !isNil(updatedDurationValidationState.hourlyRate)) {
                if (numbersAreEqualWithPrecision(updatedDurationValidationState.hourlyRate, 0.00)) {
                    updatedDurationValidationState.message = 'If the activity is billable, then the hourly rate cannot be 0.00.';
                } else if (updatedDurationValidationState.hourlyRate < 0.0) {
                    updatedDurationValidationState.message = 'The hourly rate cannot be negative.';
                } else {
                    updatedDurationValidationState.isValid = true;
                    updatedDurationValidationState.billableAmount = updatedDurationValidationState.netDuration.asHours() * updatedDurationValidationState.hourlyRate;

                    const hourlyRateFormatted = updatedDurationValidationState.hourlyRate
                        .toLocaleString(
                            'en-US', // TODO: Make to dynamic/configurable per settings
                            {
                                style: 'currency',
                                currency: 'USD',  // TODO: Make to dynamic/configurable per settings
                                minimumFractionDigits: 2,
                            });

                    const totalBillableAmountFormatted = updatedDurationValidationState.billableAmount
                        .toLocaleString(
                            'en-US', // TODO: Make to dynamic/configurable per settings
                            {
                                style: 'currency',
                                currency: 'USD',  // TODO: Make to dynamic/configurable per settings
                                minimumFractionDigits: 2,
                            });

                    updatedDurationValidationState.message = `${updatedDurationValidationState.netDuration.humanize()} at ${hourlyRateFormatted} = ${totalBillableAmountFormatted}`;
                }
            } else { // Not Billable
                updatedDurationValidationState.isValid = true;
                updatedDurationValidationState.message = updatedDurationValidationState.netDuration.humanize();
            }
        }
    }

    return {
        ...state,
        dirtyTimeActivity: updatedDirtyTimeActivity,
        validation: {
            ...state.validation,
            duration: updatedDurationValidationState,
        },
    };
}

export const reducer: Reducer<TimeActivityStoreState> = (state: TimeActivityStoreState | undefined, incomingAction: Action): TimeActivityStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            /* BEGIN: REST API Actions */
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

            case ActionType.REQUEST_SAVE_NEW_TIME_ACTIVITY:
            case ActionType.REQUEST_SAVE_UPDATED_TIME_ACTIVITY:
                return {
                    ...state,
                    isSaving: true,
                };

            case ActionType.NEW_TIME_ACTIVITY_SAVE_COMPLETED:
            case ActionType.UPDATED_TIME_ACTIVITY_SAVE_COMPLETED:
                return {
                    ...state,
                    isSaving: false,
                    existingTimeActivity: action.savedTimeActivity,
                };

            case ActionType.SAVE_TIME_ACTIVITY_ERROR:
                return {
                    ...state,
                    isSaving: false,
                };

            case ActionType.REQUEST_DELETE_TIME_ACTIVITY:
                return {
                    ...state,
                    isDeleting: true,
                };

            case ActionType.DELETE_TIME_ACTIVITY_COMPLETED:
                return unloadedState;

            case ActionType.DELETE_TIME_ACTIVITY_ERROR:
                return {
                    ...state,
                    isDeleting: false,
                };
            /* END: REST API Actions */

            /* BEGIN: UI Gesture Actions for Time Activity Details Report/Listing Page */
            case ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_CUSTOMER_FILTER:
                return {
                    ...state,
                    filterByCustomerNumber: action.customerNumber,
                };

            case ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_END:
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_START:
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
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
            /* END: UI Gesture Actions for Time Activity Details Report/Listing Page */

            /* BEGIN: Initialize New/Select Existing Time Activity to View/Manage */
            case ActionType.INITIALIZE_NEW_TIME_ACTIVITY: {
                let employeeId = null;
                let hourlyBillingRate = 0.0;
                let hourlyBillingRateAsString = '0.00';
                let isBillable = false;

                if (!isNil(action.employee)) {
                    employeeId = action.employee.id;
                    isBillable = action.employee.isBillableByDefault;
                    hourlyBillingRate = action.employee.hourlyBillableRate;
                    hourlyBillingRateAsString = formatWithTwoDecimalPlaces(hourlyBillingRate.toString());
                }

                return {
                    ...state,
                    dirtyTimeActivity: {
                        employeeId,
                        isBillable,
                        hourlyBillingRate,
                        hourlyBillingRateAsString,
                        tenantId: action.tenantId,
                        customerId: null,
                        productId: null,
                        date: moment().format('YYYY-MM-DD'),
                        timeZone: 'America/Los_Angeles', // TODO: Get this default from settings or preferences somewhere
                        startTime: null,
                        endTime: null,
                        break: null,
                        description: null,
                    },
                    // TODO: Validation state
                };
            }

            case ActionType.SELECT_EXISTING_TIME_ACTIVITY: {
                const dirtyTimeActivity = cloneDeep(action.selectedTimeActivity);

                return {
                    ...state,
                    dirtyTimeActivity,
                    existingTimeActivity: action.selectedTimeActivity,
                    // TODO: Validation state
                };
            }
            /* END: Initialize New/Select Existing Time Activity to View/Manage */

            /* BEGIN: UI Gesture Actions for single Time Activity Entry Modal Dialog */
            case ActionType.UPDATE_TIME_ACTIVITY_BREAK_TIME: {
                const updatedDirtyTimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    break: action.breakTime,
                };

                return updateTimeActivityDurationState(state, updatedDirtyTimeActivity);
            }

            case ActionType.UPDATE_TIME_ACTIVITY_CUSTOMER:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        customerId: action.customerId,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_DATE: {
                const updatedDirtyTimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    date: action.date,
                };

                return updateTimeActivityDurationState(state, updatedDirtyTimeActivity);
            }

            case ActionType.UPDATE_TIME_ACTIVITY_DESCRIPTION:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        description: action.description,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_EMPLOYEE:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        employeeId: action.employeeId,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_END_TIME:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        endTime: action.endTime,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_HOURLY_RATE:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        hourlyBillingRate: action.hourlyRate,
                        hourlyBillingRateAsString: action.hourlyRateAsString,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_IS_BILLABLE:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        isBillable: action.isBillable,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_PRODUCT:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        productId: action.productId,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_START_TIME:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        startTime: action.startTime,
                    },
                };

            case ActionType.UPDATE_TIME_ACTIVITY_TIME_ZONE:
                return {
                    ...state,
                    dirtyTimeActivity: {
                        ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                        timeZone: action.timeZoneId,
                    },
                };
            /* END: UI Gesture Actions for single Time Activity Entry Modal Dialog */

            /* BEGIN: Resets */
            case ActionType.RESET_DIRTY_TIME_ACTIVITY:
                return {
                    ...state,
                    dirtyTimeActivity: null,
                    validation: { ...DEFAULT_VALIDATION_STATE },
                };

            case ActionType.RESET_TIME_ACTIVITY_STORE_STATE:
                return unloadedState;
            /* END: Resets */
        }
    }

    return state;
}