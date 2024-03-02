﻿import {
    configureStore,
    ConfigureStoreOptions,
} from '@reduxjs/toolkit';
import {
    TypedUseSelectorHook,
    useDispatch,
    useSelector,
} from 'react-redux';
import { api } from './api';
import accounts from '../features/accounting/chart-of-accounts/accountsSlice';
import ledger from '../features/accounting/general-ledger/ledgerSlice';
import tenants from './tenantsSlice';

export const createStore = (
    options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
    configureStore({
        reducer: {
            [api.reducerPath]: api.reducer,
            accounts,
            ledger,
            tenants,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(api.middleware),
        ...options,
    });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
