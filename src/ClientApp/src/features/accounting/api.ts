import {
    Account,
    JournalEntry,
    LedgerAccount,
} from './models';
import { api } from '../../app/api';

/**
 * Request parameters for the Ledger Report (General Ledger index page list data)
 */
export type LedgerReportQueryParms = {
    /**
     * Tenant ID (GUID)
     */
    tenantId: string;

    /**
     * Start date for the Ledger Report date range.  Date only in YYYY-MM-DD format.
     */
    dateRangeStart: string;

    /**
     * End date for the Ledger Report date range.  Date only in YYYY-MM-DD format.
     */
    dateRangeEnd: string;
}

/**
 * Request parameters for the Ledger Report (General Ledger index page list data)
 */
export type JournalEntryQueryParams = {
    /**
     * Tenant ID (GUID)
     */
    tenantId: string;

    /**
     * Entry ID (unsigned [positive] integer)
     */
    entryId: number;
}

export const accountingApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAccounts: build.query<Account[], string>({
            query: (tenantId) => `ledger/${tenantId}/accounts`,
        }),
        getJournalEntry: build.query<JournalEntry, JournalEntryQueryParams>({
            query: ({ tenantId, entryId }) => `journal/${tenantId}/entry/${entryId}`,
        }),
        getLedgerReport: build.query<LedgerAccount[], LedgerReportQueryParms>({
            query: ({ tenantId, dateRangeStart, dateRangeEnd }) => `ledger/${tenantId}/report?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`,
        }),
    }),
});

export const {
    useGetAccountsQuery,
    useGetJournalEntryQuery,
    useGetLedgerReportQuery,
} = accountingApi;

export const {
    endpoints: {
        getAccounts,
        getJournalEntry,
        getLedgerReport,
    },
} = accountingApi;
