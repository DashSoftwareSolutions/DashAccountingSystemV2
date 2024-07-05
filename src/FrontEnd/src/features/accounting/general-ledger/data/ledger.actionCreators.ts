import {
    isEmpty,
    isNil,
} from 'lodash';
import ActionType from '../../../../app/store/actionType';
import { AppThunkAction } from '../../../../app/store';
import {
    ILogger,
    Logger
} from '../../../../common/logging';
import { LedgerAccount } from '../../models';
import { KnownAction } from './ledger.actions';
import { DateRange } from '../../../../common/models';

const logger: ILogger = new Logger('Account Ledger');

const actionCreators = {
    requestLedgerReportData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.ledger) &&
            !isNil(appState?.bootstrap?.selectedTenant) &&
            !appState.ledger.isFetching &&
            isEmpty(appState.ledger.accounts)) {
            const tenantId = appState?.bootstrap?.selectedTenant?.id;
            const dateRangeStart = appState.ledger.dateRangeStart;
            const dateRangeEnd = appState.ledger.dateRangeEnd;

            fetch(`/api/ledger/${tenantId}/report?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`)
                .then((response) => {
                    if (!response.ok) {
                        logger.error(`API Response status: ${response.status}`);
                        return null;
                    }

                    return response.json() as Promise<LedgerAccount[]>
                })
                .then((accounts) => {
                    if (!isNil(accounts)) {
                        dispatch({ type: ActionType.RECEIVE_LEDGER_REPORT_DATA, accounts });
                    }
                });

            dispatch({ type: ActionType.REQUEST_LEDGER_REPORT_DATA });
        }
    },

    updateDateRange: (dateRange: DateRange): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE, dateRange });
    },

    updateDateRangeStart: (dateRangeStart: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_START, dateRangeStart });
    },

    updateDateRangeEnd: (dateRangeEnd: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_LEDGER_REPORT_DATE_RANGE_END, dateRangeEnd });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_LEDGER_REPORT_DATA });
    },
};

export default actionCreators;
