import {
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
    Tenant,
    UserLite,
} from '../common/models';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (build) => ({
        getTenants: build.query<Tenant[], void>({
            query: () => 'tenants',
        }),
        getUserInfo: build.query<UserLite, void>({
            query: () => 'user-info',
        }),
    }),
});

export const {
    useGetTenantsQuery,
    useGetUserInfoQuery,
} = api;