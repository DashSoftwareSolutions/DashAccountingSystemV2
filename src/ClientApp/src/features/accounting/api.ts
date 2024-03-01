import {
    Account,
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

export const accountingApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAccounts: build.query<Account[], string>({
            query: (tenantId) => `ledger/${tenantId}/accounts`,
        }),
        getLedgerReport: build.query<LedgerAccount[], LedgerReportQueryParms>({
            query: ({ tenantId, dateRangeStart, dateRangeEnd }) => `ledger/${tenantId}/report?dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`,
        }),
    }),
});

export const {
    useGetAccountsQuery,
    useGetLedgerReportQuery,
} = accountingApi;

export const {
    endpoints: {
        getAccounts,
        getLedgerReport,
    },
} = accountingApi;