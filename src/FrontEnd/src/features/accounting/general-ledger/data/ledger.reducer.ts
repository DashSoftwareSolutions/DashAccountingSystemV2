import { isNil } from 'lodash';
import { DateTime } from 'luxon';
import {
    Action,
    Reducer,
} from 'redux';
import {
    ILogger,
    Logger
} from '../../../../common/logging';
import { DateTimeString } from '../../../../common/models';
import ActionType from '../../../../app/store/actionType';
import { KnownAction } from './ledger.actions';
import { LedgerAccount } from '../../models';

const logger: ILogger = new Logger('Ledger Reducer');

export interface LedgerState {
    accounts: LedgerAccount[];
    isFetching: boolean;
    dateRangeStart: DateTimeString;
    dateRangeEnd: DateTimeString;
}

const getDefaultDateRangeStart = (): DateTimeString => {
    const today = DateTime.now();
    let startDate = today.startOf('quarter');
    logger.info('Start of Quarter:', startDate.toISODate());

    // If start of quarter is less than a month before today, back it up one month
    const monthsSinceStartOfQuarter = today.diff(startDate, 'months').as('months');
    logger.info('Difference between today and start of the current quarter in months:', monthsSinceStartOfQuarter);

    if (monthsSinceStartOfQuarter < 1) {
        startDate = startDate.minus({ months: 1 });
        logger.info('Updated Start Date:', startDate.toISODate());
    }

    return startDate.toISODate();
}

const unloadedState: LedgerState = {
    accounts: [],
    isFetching: false,
    dateRangeStart: getDefaultDateRangeStart(),
    dateRangeEnd: DateTime.now().toISODate(),
};

const reducer: Reducer<LedgerState> = (state: LedgerState | undefined, incomingAction: Action): LedgerState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_LEDGER_REPORT_DATA:
                return {
                    ...state,
                    isFetching: true,
                };

            case ActionType.RECEIVE_LEDGER_REPORT_DATA:
                return {
                    ...state,
                    isFetching: false,
                    accounts: action.accounts,
                };

            case ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE:
                return {
                    ...state,
                    dateRangeEnd: action.dateRange.dateRangeEnd,
                    dateRangeStart: action.dateRange.dateRangeStart,
                };

            case ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_START:
                return {
                    ...state,
                    dateRangeStart: action.dateRangeStart,
                };

            case ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_END:
                return {
                    ...state,
                    dateRangeEnd: action.dateRangeEnd,
                };

            case ActionType.RESET_LEDGER_REPORT_DATA:
                return {
                    ...state,
                    isFetching: false,
                    accounts: [],
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
