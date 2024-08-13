import {
    cloneDeep,
    isEmpty,
    isNil,
    trim,
} from 'lodash';
import {
    DateTime,
    Duration,
} from 'luxon';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './timeTracking.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { numbersAreEqualWithPrecision } from '../../../../common/utilities/numericUtils';
import {
    formatWithTwoDecimalPlaces,
    isStringNullOrWhiteSpace,
} from '../../../../common/utilities/stringUtils';
import { EmployeeLite } from '../../employees/models';
import {
    TimeActivity,
    TimeActivityDetailsReport,
} from '../models';

export interface TimeActivityValidationState {
    areAllRequiredAttributesSet: boolean;
    billableAmount: number | null;
    breakTimeDuration: Duration | null;
    canSave: boolean;
    endTime: DateTime | null;
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
    startTime: DateTime | null;
    workTimeDuration: Duration | null;
}

const DEFAULT_VALIDATION_STATE: TimeActivityValidationState = {
    areAllRequiredAttributesSet: false,
    billableAmount: null,
    breakTimeDuration: null,
    canSave: false,
    endTime: null,
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
    startTime: null,
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
    isFetching: boolean;
    isDeleting: boolean;
    isSaving: boolean;
    validation: TimeActivityValidationState;
}

const today = DateTime.now().toISODate();

const unloadedState: TimeActivityStoreState = {
    currentUserEmployee: null,
    dateRangeStart: today,
    dateRangeEnd: today,
    detailsReportData: null,
    dirtyTimeActivity: null,
    existingTimeActivity: null,
    filterByCustomerNumber: null,
    filterByEmployeeNumber: null,
    isFetching: false,
    isDeleting: false,
    isSaving: false,
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
};

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

    const { hours, minutes } = duration.toObject();
    const hourString = hours === 0 ? '' : `${hours} ${hours === 1 ? 'hour' : 'hours'}`; // TODO: i18n on 'hour(s)'
    const minutesString = minutes === 0 ? '' : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`; // TODO: i18n on 'minute(s)'
    return trim(`${hourString} ${minutesString}`);
};

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

        updatedValidationState.startTime = DateTime.fromISO(`${updatedDirtyTimeActivity.date}T${updatedDirtyTimeActivity.startTime}`).setZone(updatedDirtyTimeActivity.timeZone ?? '');
        updatedValidationState.endTime = DateTime.fromISO(`${updatedDirtyTimeActivity.date}T${updatedDirtyTimeActivity.endTime}`).setZone(updatedDirtyTimeActivity.timeZone ?? '');

        if (updatedValidationState.startTime.toMillis() === updatedValidationState.endTime.toMillis()) {
            updatedValidationState.message = 'Start time and end time are the same.  Zero time worked.  Please correct.';
            updatedValidationState.isValid = false;
            updatedValidationState.canSave = false;
        } else if (updatedValidationState.startTime > updatedValidationState.endTime) {
            updatedValidationState.message = 'Start time is after end time.  Please correct.';
            updatedValidationState.isValid = false;
            updatedValidationState.canSave = false;
        } else {
            updatedValidationState.workTimeDuration = updatedValidationState.endTime.diff(updatedValidationState.startTime);

            if (!isEmpty(updatedDirtyTimeActivity.break)) {
                updatedValidationState.breakTimeDuration = Duration.fromISOTime(`${updatedDirtyTimeActivity.break}:00`);

                if (updatedValidationState.breakTimeDuration.valueOf() >= updatedValidationState.workTimeDuration.valueOf()) {
                    updatedValidationState.message = 'The break time must be less than the total time worked. Please correct.';
                    updatedValidationState.isValid = false;
                    updatedValidationState.canSave = false;
                } else {
                    updatedValidationState.netDuration = updatedValidationState.workTimeDuration.minus(updatedValidationState.breakTimeDuration);
                }
            } else { // no break
                updatedValidationState.netDuration = cloneDeep(updatedValidationState.workTimeDuration);
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
                        updatedValidationState.billableAmount = updatedValidationState.netDuration.as('hours') * updatedValidationState.hourlyRate;

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

                        updatedValidationState.message = `${poorMansHumanize(updatedValidationState.netDuration)} at ${hourlyRateFormatted} per hour = ${totalBillableAmountFormatted}`;
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
};

const reducer: Reducer<TimeActivityStoreState> = (state: TimeActivityStoreState | undefined, incomingAction: Action): TimeActivityStoreState => {
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
                    isFetching: true,
                };

            case ActionType.RECEIVE_TIME_ACTIVITY_DETAILS_REPORT:
                return {
                    ...state,
                    isFetching: false,
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
                    isFetching: false,
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
                    date: DateTime.now().toISODate(),
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
};

export default reducer;
