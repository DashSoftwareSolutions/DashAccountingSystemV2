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
    trim,
} from 'lodash';
import moment, { Duration, Moment } from 'moment-timezone';
import { AppThunkAction } from './';
import {
    formatWithTwoDecimalPlaces,
    isStringNullOrWhiteSpace,
} from '../common/StringUtils';
import { Logger } from '../common/Logging';
import { numbersAreEqualWithPrecision } from '../common/NumericUtils';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import IAction from './IAction';
import TimeActivity from '../models/TimeActivity';
import TimeActivityDetailsReport from '../models/TimeActivityDetailsReport';
import EmployeeLite from '../models/EmployeeLite';

export interface TimeActivityValidationState {
    areAllRequiredAttributesSet: boolean;
    billableAmount: number | null;
    breakTimeDuration: Duration | null;
    canSave: boolean;
    endTimeMoment: Moment | null;
    hasBreakTime: boolean;
    hasDate: boolean;
    hasEndTime: boolean;
    hasStartTime: boolean;
    hasTimeZone: boolean;
    hourlyRate: number | null;
    isBillable: boolean;
    isValid: boolean;
    message: string;
    netDuration: Duration | null;
    startTimeMoment: Moment | null;
    workTimeDuration: Duration | null;
}

const DEFAULT_VALIDATION_STATE: TimeActivityValidationState = {
    areAllRequiredAttributesSet: false,
    billableAmount: null,
    breakTimeDuration: null,
    canSave: false,
    endTimeMoment: null,
    hasBreakTime: false,
    hasDate: false,
    hasEndTime: false,
    hasStartTime: false,
    hasTimeZone: false,
    hourlyRate: null,
    isBillable: false,
    isValid: false,
    message: '',
    netDuration: null,
    startTimeMoment: null,
    workTimeDuration: null,
};

export interface TimeActivityStoreState {
    currentUserEmployee: EmployeeLite | null;
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

        const dirtyTimeActivity: TimeActivity | null = appState.timeActivity?.dirtyTimeActivity ?? null;

        if (isNil(dirtyTimeActivity)) {
            logger.warn('No Time Activity found in store state.  Bailing out...');
            return;
        }

        if (!appState.timeActivity?.validation?.canSave) {
            logger.info('Cannot save Time Activity.  Bailing out...');
        }

        const timeActivityToSave: TimeActivity = {
            ...dirtyTimeActivity,
            startTime: `${dirtyTimeActivity.startTime}:00`, // add seconds so it is interpreetted correctly on the back-end
            endTime: `${dirtyTimeActivity.endTime}:00`,
            break: isEmpty(dirtyTimeActivity.break) ? null : `${dirtyTimeActivity.break}:00`,
        };

        logger.info('Finalized Time Activity ready to save:', timeActivityToSave);

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
        const employees = appState?.employees?.employees;
        const currentUserEmployee = find(employees, (e) => e.isUser && e.userId === user.sub);

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


const today = moment().format('YYYY-MM-DD');

const unloadedState: TimeActivityStoreState = {
    currentUserEmployee: null,
    dateRangeStart: today,
    dateRangeEnd: today,
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

/**
 * Checks if all required attributes are set on the Time Activity
 * 
 * @param {TimeActivity} timeActivity
 * @returns {boolean}
 */
const checkIfAllRequiredAttributesAreSet = (timeActivity: TimeActivity): boolean => {
    return !isNil(timeActivity.customerId) &&
        !isNil(timeActivity.employeeId) &&
        !isNil(timeActivity.productId) &&
        !isEmpty(timeActivity.timeZone) &&
        !isEmpty(timeActivity.date) &&
        !isEmpty(timeActivity.startTime) &&
        !isEmpty(timeActivity.endTime) &&
        !isStringNullOrWhiteSpace(timeActivity.description);
}

/**
 * Function to produce a textual description of the duration "H hour(s) M minutes(s)".
 * The built-in `humanize()` function has some other quirks and isn't suitable for this.
 * 
 * @param {Duration} duration
 * @returns {string}
 */
const poorMansHumanize = (duration: Duration | null): string => {
    if (isNil(duration)) {
        return '';
    }

    const hours = duration.hours();
    const minutes = duration.minutes();

    const hourString = hours === 0 ? '' : `${hours} ${hours === 1 ? 'hour' : 'hours'}`; // TODO: i18n on 'hour(s)'
    const minutesString = minutes === 0 ? '' : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`; // TODO: i18n on 'minute(s)'
    return trim(`${hourString} ${minutesString}`);
}

/**
 * Computes the totals and validation state related to total time worked and total billable amount.
 * 
 * @param {TimeActivityStoreState} state
 * @param {TimeActivity} updatedDirtyTimeActivity
 * @returns {TimeActivityStoreState}
 */
const updateTimeActivityDurationState = (state: TimeActivityStoreState, updatedDirtyTimeActivity: TimeActivity): TimeActivityStoreState => {
    const { validation } = state;

    const updatedValidationState: TimeActivityValidationState = {
        ...validation as Pick<TimeActivityValidationState, keyof TimeActivityValidationState>,
        areAllRequiredAttributesSet: checkIfAllRequiredAttributesAreSet(updatedDirtyTimeActivity),
        canSave: false,
        isValid: false,
        message: '',
    };

    updatedValidationState.hasDate = !isEmpty(updatedDirtyTimeActivity.date);
    updatedValidationState.hasStartTime = !isEmpty(updatedDirtyTimeActivity.startTime);
    updatedValidationState.hasEndTime = !isEmpty(updatedDirtyTimeActivity.endTime);
    updatedValidationState.hasTimeZone = !isEmpty(updatedDirtyTimeActivity.timeZone);
    updatedValidationState.isBillable = updatedDirtyTimeActivity.isBillable;
    updatedValidationState.hourlyRate = updatedDirtyTimeActivity.hourlyBillingRate;

    if (updatedValidationState.hasDate &&
        updatedValidationState.hasStartTime &&
        updatedValidationState.hasEndTime &&
        updatedValidationState.hasTimeZone) {
        // assume it might be valid at this point
        updatedValidationState.isValid = true;

        updatedValidationState.startTimeMoment = moment.tz(`${updatedDirtyTimeActivity.date} ${updatedDirtyTimeActivity.startTime}`, updatedDirtyTimeActivity.timeZone ?? '');
        updatedValidationState.endTimeMoment = moment.tz(`${updatedDirtyTimeActivity.date} ${updatedDirtyTimeActivity.endTime}`, updatedDirtyTimeActivity.timeZone ?? '');

        if (updatedValidationState.startTimeMoment.isSame(updatedValidationState.endTimeMoment)) {
            updatedValidationState.message = 'Start time and end time are the same.  Zero time worked.  Please correct.';
            updatedValidationState.isValid = false;
            updatedValidationState.canSave = false;
        } else if (updatedValidationState.startTimeMoment.isAfter(updatedValidationState.endTimeMoment)) {
            updatedValidationState.message = 'Start time is after end time.  Please correct.';
            updatedValidationState.isValid = false;
            updatedValidationState.canSave = false;
        } else {
            updatedValidationState.workTimeDuration = moment.duration(updatedValidationState.endTimeMoment.diff(updatedValidationState.startTimeMoment));

            if (!isEmpty(updatedDirtyTimeActivity.break)) {
                updatedValidationState.breakTimeDuration = moment.duration(`${updatedDirtyTimeActivity.break}:00`);

                if (updatedValidationState.breakTimeDuration.valueOf() >= updatedValidationState.workTimeDuration.valueOf()) {
                    updatedValidationState.message = 'The break time must be less than the total time worked. Please correct.';
                    updatedValidationState.isValid = false;
                    updatedValidationState.canSave = false;
                } else {
                    updatedValidationState.netDuration = updatedValidationState.workTimeDuration.subtract(updatedValidationState.breakTimeDuration);
                }
            } else { // no break
                updatedValidationState.netDuration = updatedValidationState.workTimeDuration.clone();
            }

            if (!isNil(updatedValidationState.netDuration) &&
                updatedValidationState.isValid) {
                if (updatedValidationState.isBillable &&
                    !isNil(updatedValidationState.hourlyRate)) {
                    if (numbersAreEqualWithPrecision(updatedValidationState.hourlyRate, 0.00)) {
                        updatedValidationState.message = 'If the activity is billable, then the hourly rate cannot be 0.00.  Please correct.';
                    } else if (updatedValidationState.hourlyRate < 0.0) {
                        updatedValidationState.message = 'The hourly rate cannot be negative.  Please correct.';
                    } else {
                        updatedValidationState.isValid = true;
                        updatedValidationState.canSave = updatedValidationState.areAllRequiredAttributesSet && updatedValidationState.isValid;
                        updatedValidationState.billableAmount = updatedValidationState.netDuration.asHours() * updatedValidationState.hourlyRate;

                        const hourlyRateFormatted = updatedValidationState.hourlyRate
                            .toLocaleString(
                                'en-US', // TODO: Make dynamic/configurable per settings
                                {
                                    style: 'currency',
                                    currency: 'USD',  // TODO: Make dynamic/configurable per settings
                                    minimumFractionDigits: 2,
                                });

                        const totalBillableAmountFormatted = updatedValidationState.billableAmount
                            .toLocaleString(
                                'en-US', // TODO: Make dynamic/configurable per settings
                                {
                                    style: 'currency',
                                    currency: 'USD',  // TODO: Make dynamic/configurable per settings
                                    minimumFractionDigits: 2,
                                });

                        updatedValidationState.message = `${poorMansHumanize(updatedValidationState.netDuration)} at ${hourlyRateFormatted} = ${totalBillableAmountFormatted}`;
                    }
                } else { // Not Billable
                    updatedValidationState.message = poorMansHumanize(updatedValidationState.netDuration);
                }
            }
        }
    }

    return {
        ...state,
        dirtyTimeActivity: updatedDirtyTimeActivity,
        validation: updatedValidationState,
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
                let employeeId: string | null = null;
                let hourlyBillingRate: number | null = null;
                let hourlyBillingRateAsString: string | null = null;
                let isBillable = false;

                let updatedState = { ...state };

                if (!isNil(action.employee)) {
                    updatedState.currentUserEmployee = action.employee;

                    employeeId = action.employee.id;
                    isBillable = action.employee.isBillableByDefault;
                    hourlyBillingRate = action.employee.hourlyBillableRate;
                    hourlyBillingRateAsString = !isNil(hourlyBillingRate) ?
                        formatWithTwoDecimalPlaces(hourlyBillingRate.toString()) :
                        null;
                }

                const dirtyTimeActivity: TimeActivity = {
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
                };

                return updateTimeActivityDurationState(updatedState, dirtyTimeActivity);
            }

            case ActionType.SELECT_EXISTING_TIME_ACTIVITY: {
                const dirtyTimeActivity = cloneDeep(action.selectedTimeActivity);

                // Set hourly billing rate formatted as a string
                dirtyTimeActivity.hourlyBillingRateAsString =
                    !isNil(dirtyTimeActivity.hourlyBillingRate) ?
                        formatWithTwoDecimalPlaces(dirtyTimeActivity.hourlyBillingRate.toString()) :
                        null;

                // Strip seconds and leading zero from break time
                dirtyTimeActivity.break = !isNil(dirtyTimeActivity.break) ?
                    dirtyTimeActivity.break.replace(/:00$/, '').replace(/^0/, '') :
                    null;

                return updateTimeActivityDurationState(
                    {
                        ...state,
                        existingTimeActivity: action.selectedTimeActivity,
                    },
                    dirtyTimeActivity);
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

            case ActionType.UPDATE_TIME_ACTIVITY_CUSTOMER: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    customerId: action.customerId,
                };

                const areAllRequiredAttributesSet = checkIfAllRequiredAttributesAreSet(updatedTimeActivity);

                return {
                    ...state,
                    dirtyTimeActivity: updatedTimeActivity,
                    validation: {
                        ...state.validation,
                        areAllRequiredAttributesSet,
                        canSave: areAllRequiredAttributesSet && state.validation.isValid,
                    },
                };
            }

            case ActionType.UPDATE_TIME_ACTIVITY_DATE: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    date: action.date,
                };

                return updateTimeActivityDurationState(state, updatedTimeActivity);
            }

            case ActionType.UPDATE_TIME_ACTIVITY_DESCRIPTION: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    description: action.description,
                };

                const areAllRequiredAttributesSet = checkIfAllRequiredAttributesAreSet(updatedTimeActivity);

                return {
                    ...state,
                    dirtyTimeActivity: updatedTimeActivity,
                    validation: {
                        ...state.validation,
                        areAllRequiredAttributesSet,
                        canSave: areAllRequiredAttributesSet && state.validation.isValid,
                    },
                };
            }

            case ActionType.UPDATE_TIME_ACTIVITY_EMPLOYEE: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    employeeId: action.employeeId,
                };

                const areAllRequiredAttributesSet = checkIfAllRequiredAttributesAreSet(updatedTimeActivity);

                return {
                    ...state,
                    dirtyTimeActivity: updatedTimeActivity,
                    validation: {
                        ...state.validation,
                        areAllRequiredAttributesSet,
                        canSave: areAllRequiredAttributesSet && state.validation.isValid,
                    },
                };
            }

            case ActionType.UPDATE_TIME_ACTIVITY_END_TIME: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    endTime: action.endTime,
                };

                return updateTimeActivityDurationState(state, updatedTimeActivity);
            }

            case ActionType.UPDATE_TIME_ACTIVITY_HOURLY_RATE: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    hourlyBillingRate: action.hourlyRate,
                    hourlyBillingRateAsString: action.hourlyRateAsString,
                };

                return updateTimeActivityDurationState(state, updatedTimeActivity);
            }

            case ActionType.UPDATE_TIME_ACTIVITY_IS_BILLABLE: {
                const { isBillable } = action;

                let hourlyBillingRate: number | null = null;
                let hourlyBillingRateAsString: string | null = null;

                if (isBillable) {
                    const { currentUserEmployee } = state;

                    if (!isNil(currentUserEmployee)) {
                        hourlyBillingRate = currentUserEmployee.hourlyBillableRate;
                        hourlyBillingRateAsString = !isNil(hourlyBillingRate) ?
                            formatWithTwoDecimalPlaces(hourlyBillingRate.toString()) :
                            null;
                    }
                }

                const updatedDirtyTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    hourlyBillingRate,
                    hourlyBillingRateAsString,
                    isBillable,
                };

                return updateTimeActivityDurationState(state, updatedDirtyTimeActivity);
            }

            case ActionType.UPDATE_TIME_ACTIVITY_PRODUCT: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    productId: action.productId,
                };

                const areAllRequiredAttributesSet = checkIfAllRequiredAttributesAreSet(updatedTimeActivity);

                return {
                    ...state,
                    dirtyTimeActivity: updatedTimeActivity,
                    validation: {
                        ...state.validation,
                        areAllRequiredAttributesSet,
                        canSave: areAllRequiredAttributesSet && state.validation.isValid,
                    },
                };
            }

            case ActionType.UPDATE_TIME_ACTIVITY_START_TIME: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    startTime: action.startTime,
                };

                return updateTimeActivityDurationState(state, updatedTimeActivity);
            }

            case ActionType.UPDATE_TIME_ACTIVITY_TIME_ZONE: {
                const updatedTimeActivity: TimeActivity = {
                    ...state.dirtyTimeActivity as Pick<TimeActivity, keyof TimeActivity>,
                    timeZone: action.timeZoneId,
                };

                return updateTimeActivityDurationState(state, updatedTimeActivity);
            }
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