import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import {
    ILogger,
    Logger
} from '../../../common/logging';
import { DateRange } from '../../../common/models';
import { LedgerAccount } from '../models';
import { accountingApi } from '../api';
import { isNil } from 'lodash';

const logger: ILogger = new Logger('Ledger Slice');

type SliceState = {
    accounts: LedgerAccount[];
    isLoading: boolean;
    dateRangeStart: string;
    dateRangeEnd: string;
};

const getDefaultDateRangeStart = (): string => {
    const today = DateTime.now();
    let startDate = today.startOf('quarter');
    logger.info('Start of Quarter:', startDate.toISODate());

    // If start of quarter is less than a month before today, back it up one month
    const difference = today.diff(startDate);
    const differenceInMonths = difference.shiftToAll().months;
    logger.info('Difference between today and start of the current quarter in months:', differenceInMonths);

    if (isNil(differenceInMonths) || differenceInMonths < 1) {
        startDate = startDate.minus({ months: 1 });
        logger.info('Updated Start Date:', startDate.toISODate());
    }

    return startDate.toISODate();
}

const initialState: SliceState = {
    accounts: [],
    isLoading: false,
    dateRangeStart: getDefaultDateRangeStart(),
    dateRangeEnd: DateTime.now().toISODate(),
};

const slice = createSlice({
    name: 'ledger',
    initialState,
    reducers: (create) => ({
        setDateRange: create.reducer((state, action: PayloadAction<DateRange>) => {
            state.dateRangeStart = action.payload.dateRangeStart;
            state.dateRangeEnd = action.payload.dateRangeEnd;
        }),
        setDateRangeStart: create.reducer((state, action: PayloadAction<string>) => {
            state.dateRangeStart = action.payload;
        }),
        setDateRangeEnd: create.reducer((state, action: PayloadAction<string>) => {
            state.dateRangeEnd = action.payload;
        })
    }),
    extraReducers: (builder) => {
        builder
            .addMatcher(accountingApi.endpoints.getLedgerReport.matchPending, (state, action) => {
                logger.info('Fetching the Ledger Report', action);
                state.isLoading = true;
            })
            .addMatcher(accountingApi.endpoints.getLedgerReport.matchFulfilled, (state, action) => {
                logger.info('Received the Ledger Report', action);
                state.isLoading = false;
                state.accounts = action.payload;
            })
            .addMatcher(accountingApi.endpoints.getLedgerReport.matchRejected, (state, action) => {
                logger.info('Error fetching the Ledger Report', action);
                state.isLoading = false;
            });
    },
    selectors: {
        selectLedgerAccounts: state => state.accounts,
        selectIsLoadingLedgerReport: state => state.isLoading,
        selectLedgerReportDateRangeStart: state => state.dateRangeStart,
        selectLedgerReportDateRangeEnd: state => state.dateRangeEnd,
    },
});

export default slice.reducer;

export const {
    setDateRange,
    setDateRangeStart,
    setDateRangeEnd,
} = slice.actions;

export const {
    selectIsLoadingLedgerReport,
    selectLedgerAccounts,
    selectLedgerReportDateRangeStart,
    selectLedgerReportDateRangeEnd,
} = slice.selectors;

