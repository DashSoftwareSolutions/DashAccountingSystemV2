import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './timeTracking.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    ILogger,
    Logger,
} from '../../../../common/logging';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import {
    TimeActivity,
    TimeActivityDetailsReport,
} from '../models';

const logger: ILogger = new Logger('Time Tracking Actions');

const actionCreators = {
    /* BEGIN: REST API Actions */
    requestTimeActivityDetailsReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.timeTracking) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.timeTracking.isFetching &&
            isEmpty(appState.timeTracking?.detailsReportData)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;

            const {
                dateRangeStart,
                dateRangeEnd,
                filterByCustomerNumber,
                filterByEmployeeNumber,
            } = appState.timeTracking;

            let reportRequestUrl = `/api/time-tracking/${tenantId}/time-activities-report?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`;

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
                        dispatch({
                            type: ActionType.RECEIVE_TIME_ACTIVITY_DETAILS_REPORT,
                            data,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_TIME_ACTIVITY_DETAILS_REPORT });
        }
    },

    saveNewTimeActivity: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        const dirtyTimeActivity: TimeActivity | null = appState.timeTracking?.dirtyTimeActivity ?? null;

        if (isNil(dirtyTimeActivity)) {
            logger.warn('No Time Activity found in store state.  Bailing out...');
            return;
        }

        if (!appState.timeTracking?.validation?.canSave) {
            logger.info('Cannot save Time Activity.  Bailing out...');
        }

        const timeActivityToSave: TimeActivity = {
            ...dirtyTimeActivity,
            startTime: `${dirtyTimeActivity.startTime}:00`, // add seconds so it is interpretted correctly on the back-end
            endTime: `${dirtyTimeActivity.endTime}:00`,
            break: isEmpty(dirtyTimeActivity.break) ? null : `${dirtyTimeActivity.break}:00`,
        };

        logger.info('Finalized Time Activity ready to save:', timeActivityToSave);

        const accessToken = appState.authentication.tokens?.accessToken;

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(timeActivityToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/time-tracking/time-activity', requestOptions)
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
                    dispatch({
                        type: ActionType.NEW_TIME_ACTIVITY_SAVE_COMPLETED,
                        savedTimeActivity,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_TIME_ACTIVITY });
    },

    updateTimeActivity: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        const dirtyTimeActivity: TimeActivity | null = appState.timeTracking?.dirtyTimeActivity ?? null;

        if (isNil(dirtyTimeActivity)) {
            logger.warn('No Time Activity found in store state.  Bailing out...');
            return;
        }

        if (!appState.timeTracking?.validation?.canSave) {
            logger.info('Cannot save Time Activity.  Bailing out...');
        }

        const timeOfDayRegex = new RegExp(/^\d{1,2}:\d{2}:00$/);

        const timeActivityToSave: TimeActivity = {
            ...dirtyTimeActivity,
            startTime: timeOfDayRegex.test(dirtyTimeActivity.startTime ?? '') ?
                dirtyTimeActivity.startTime :
                `${dirtyTimeActivity.startTime}:00`, // add seconds if necessary so it is interpretted correctly on the back-end
            endTime: timeOfDayRegex.test(dirtyTimeActivity.endTime ?? '') ?
                dirtyTimeActivity.endTime :
                `${dirtyTimeActivity.endTime}:00`,
            break: isEmpty(dirtyTimeActivity.break) ?
                null :
                timeOfDayRegex.test(dirtyTimeActivity.break ?? '') ?
                    dirtyTimeActivity.break :
                    `${dirtyTimeActivity.break}:00`,
        };

        logger.info('Finalized Time Activity ready to save:', timeActivityToSave);

        const accessToken = appState.authentication.tokens?.accessToken;

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(timeActivityToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`/api/time-tracking/time-activity/${timeActivityToSave.id}`, requestOptions)
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
                    dispatch({
                        type: ActionType.UPDATED_TIME_ACTIVITY_SAVE_COMPLETED,
                        savedTimeActivity,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_UPDATED_TIME_ACTIVITY });
    },

    deleteTimeActivity: (timeActivityId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const accessToken = appState.authentication.tokens?.accessToken;

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`/api/time-tracking/time-activity/${timeActivityId}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return;
                }

                dispatch({ type: ActionType.DELETE_TIME_ACTIVITY_COMPLETED });
            });

        dispatch({ type: ActionType.REQUEST_DELETE_TIME_ACTIVITY });
    },
    /* END: REST API Actions */

    /* BEGIN: Initialize New/Select Existing Time Activity to View/Manage */
    initializeNewTimeActivity: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState?.application?.selectedTenant?.id;
        const user = appState.application.userInfo;
        const employees = appState?.employees?.employees;
        const currentUserEmployee = employees.find((e) => e.isUser && e.userId === user.id);

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
        dispatch({
            type: ActionType.SELECT_EXISTING_TIME_ACTIVITY,
            selectedTimeActivity,
        });
    },
    /* END: Initialize New/Select Existing Time Activity to View/Manage */

    /* BEGIN: UI Gesture Actions for Time Activity Details Report/Listing Page */
    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_START,
            dateRangeStart,
        });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_DATE_RANGE_END,
            dateRangeEnd,
        });
    },

    updateCustomerFilter: (customerNumber: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_CUSTOMER_FILTER,
            customerNumber,
        });
    },

    updateEmployeeFilter: (employeeNumber: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_DETAILS_REPORT_EMPLOYEE_FILTER,
            employeeNumber,
        });
    },

    resetTimeActivityDetailsReportData: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_TIME_ACTIVITY_DETAILS_REPORT_DATA });
    },
    /* END: UI Gesture Actions for Time Activity Details Report/Listing Page */

    /* BEGIN: UI Gesture Actions for single Time Activity Entry Modal Dialog */
    updateBreakTime: (breakTime: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_BREAK_TIME,
            breakTime,
        });
    },

    updateCustomer: (customerId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_CUSTOMER,
            customerId,
        });
    },

    updateDate: (date: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_DATE,
            date,
        });
    },

    updateDescription: (description: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_DESCRIPTION,
            description,
        });
    },

    updateEmployee: (employeeId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_EMPLOYEE,
            employeeId,
        });
    },

    updateEndTime: (endTime: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_END_TIME,
            endTime,
        });
    },

    updateHourlyRate: (hourlyRate: number | null, hourlyRateAsString: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_HOURLY_RATE,
            hourlyRate,
            hourlyRateAsString,
        });
    },

    updateIsBillable: (isBillable: boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_IS_BILLABLE,
            isBillable,
        });
    },

    updateProduct: (productId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_PRODUCT,
            productId,
        });
    },

    updateStartTime: (startTime: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_START_TIME,
            startTime,
        });
    },

    updateTimeZone: (timeZoneId: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_TIME_ACTIVITY_TIME_ZONE,
            timeZoneId,
        });
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

export default actionCreators;
