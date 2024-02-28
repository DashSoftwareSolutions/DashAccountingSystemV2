import { Account } from './models';
import { api } from '../../app/api';

export const accountingApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAccounts: build.query<Account[], string>({
            query: (tenantId) => `ledger/${tenantId}/accounts`,
        }),
    }),
});

export const {
    useGetAccountsQuery,
} = accountingApi;

export const {
    endpoints: { getAccounts },
} = accountingApi;