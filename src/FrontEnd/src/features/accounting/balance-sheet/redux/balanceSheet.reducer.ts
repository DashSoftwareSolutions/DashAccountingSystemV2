import { isNil } from 'lodash';
import { DateTime } from 'luxon';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './balanceSheet.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateTimeString } from '../../../../common/models';
import { BalanceSheetReport } from '../models';

export interface BalanceSheetState {
    dateRangeEnd: DateTimeString;
    dateRangeStart: DateTimeString;
    isFetching: boolean;
    reportData: BalanceSheetReport | null;
}

const unloadedState: BalanceSheetState = {
    dateRangeEnd: DateTime.now().toISODate(),
    dateRangeStart: DateTime.now().startOf('year').toISODate(),
    isFetching: false,
    reportData: null,
};

const reducer: Reducer<BalanceSheetState> = (state: BalanceSheetState | undefined, incomingAction: Action): BalanceSheetState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_BALANCE_SHEET_REPORT_DATA:
                return {
                    ...state,
                    isFetching: true,
                };

            case ActionType.RECEIVE_BALANCE_SHEET_REPORT_DATA:
                return {
                    ...state,
                    isFetching: false,
                    reportData: action.report,
                };

            case ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_START:
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
                };

            case ActionType.UPDATE_BALANCE_SHEET_REPORT_DATE_RANGE_END:
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case ActionType.RESET_BALANCE_SHEET_REPORT_DATA:
                return {
                    ...state,
                    isFetching: false,
                    reportData: null,
                };

            default:
                return state;
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
}

export default reducer;
