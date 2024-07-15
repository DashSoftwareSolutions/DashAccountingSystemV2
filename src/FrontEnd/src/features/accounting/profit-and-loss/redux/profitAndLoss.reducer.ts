import { isNil } from 'lodash';
import { DateTime } from 'luxon';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './profitAndLoss.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { DateTimeString } from '../../../../common/models';
import { ProfitAndLossReport } from '../models';

export interface ProfitAndLossState {
    dateRangeEnd: DateTimeString;
    dateRangeStart: DateTimeString;
    isFetching: boolean;
    reportData: ProfitAndLossReport | null;
}

const unloadedState: ProfitAndLossState = {
    dateRangeEnd: DateTime.now().toISODate(),
    dateRangeStart: DateTime.now().startOf('year').toISODate(),
    isFetching: false,
    reportData: null,
};

const reducer: Reducer<ProfitAndLossState> = (state: ProfitAndLossState | undefined, incomingAction: Action): ProfitAndLossState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_PROFIT_AND_LOSS_REPORT_DATA:
                return {
                    ...state,
                    isFetching: true,
                };

            case ActionType.RECEIVE_PROFIT_AND_LOSS_REPORT_DATA:
                return {
                    ...state,
                    isFetching: false,
                    reportData: action.report,
                };

            case ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE: {
                return {
                    ...state,
                    dateRangeStart: action.dateRange.dateRangeStart,
                    dateRangeEnd: action.dateRange.dateRangeEnd,
                };
            }

            case ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_START:
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
                };

            case ActionType.UPDATE_PROFIT_AND_LOSS_REPORT_DATE_RANGE_END:
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case ActionType.RESET_PROFIT_AND_LOSS_REPORT_DATA:
                return {
                    ...state,
                    isFetching: false,
                    reportData: null,
                };
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
}

export default reducer;
