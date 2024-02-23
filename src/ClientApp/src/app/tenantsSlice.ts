import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    ILogger,
    Logger
} from '../common/logging';
import { api } from './api';
import { Tenant } from '../common/models';

const logger: ILogger = new Logger('Tenants Slice');

type SliceState = {
    isLoading: boolean;
    selectedTenant: Tenant | null;
    tenants: Tenant[];
};

const initialState: SliceState = {
    isLoading: false,
    selectedTenant: null,
    tenants: [],
};

const slice = createSlice({
    name: 'tenants',
    initialState,
    reducers: (create) => ({
        setSelectedTenant: create.reducer((state, action: PayloadAction<Tenant>) => {
            state.selectedTenant = action.payload;
        }),
    }),
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.getTenants.matchPending, (state, action) => {
                logger.info('Fetching the Tenants', action);
                state.isLoading = true;
            })
            .addMatcher(api.endpoints.getTenants.matchFulfilled, (state, action) => {
                logger.info('Received the Tenants', action);
                state.tenants = action.payload;
                state.isLoading = false;
            })
            .addMatcher(api.endpoints.getTenants.matchRejected, (_state, action) => {
                logger.info('Error fetching the Tenants', action);
                state.isLoading = false;
            });
    },
    selectors: {
        selectIsLoadingTenants: state => state.isLoading,
        selectSelectedTenant: state => state.selectedTenant,
        selectTenants: state => state.tenants,
    },
});

export default slice.reducer;

export const { setSelectedTenant } = slice.actions;

export const {
    selectIsLoadingTenants,
    selectSelectedTenant,
    selectTenants,
} = slice.selectors;

