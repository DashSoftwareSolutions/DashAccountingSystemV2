import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './ledger.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateRange } from '../../../../common/models';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { LedgerAccount } from '../models';

const actionCreators = {
    requestLedgerReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.ledger) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.ledger.isFetching &&
            isEmpty(appState.ledger.accounts) &&
            !isEmpty(appState.authentication.tokens?.accessToken)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;
            const dateRangeStart = appState.ledger.dateRangeStart;
            const dateRangeEnd = appState.ledger.dateRangeEnd;

            fetch(`/api/ledger/${tenantId}/report?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>)
                        return null;
                    }

                    return response.json() as Promise<LedgerAccount[]>
                })
                .then((accounts) => {
                    if (!isNil(accounts)) {
                        dispatch({
                            type: ActionType.RECEIVE_LEDGER_REPORT_DATA,
                            accounts,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_LEDGER_REPORT_DATA });
        }
    },

    updateDateRange: (dateRange: DateRange): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE,
            dateRange,
        });
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_START,
            dateRangeStart,
        });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_END,
            dateRangeEnd,
        });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_LEDGER_REPORT_DATA });
    },
};

export default actionCreators;
