import {
    groupBy,
    map,
} from 'lodash';
import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    ILogger,
    Logger
} from '../../../common/logging';
import {
    Account,
    AccountCategoryList,
    AccountSelectOption,
} from '../models';
import { accountingApi } from '../api';

const logger: ILogger = new Logger('Accounting Slice');

type SliceState = {
    isLoading: boolean;
    accounts: Account[];
    accountSelectOptions: AccountCategoryList[];
    selectedAccount: Account | null,
};

const initialState: SliceState = {
    isLoading: false,
    accounts: [],
    accountSelectOptions: [],
    selectedAccount: null,
};

const slice = createSlice({
    name: 'accounts',
    initialState,
    reducers: (create) => ({
        setSelectedAccount: create.reducer((state, action: PayloadAction<Account>) => {
            state.selectedAccount = action.payload;
        }),
    }),
    extraReducers: (builder) => {
        builder
            .addMatcher(accountingApi.endpoints.getAccounts.matchPending, (state, action) => {
                logger.info('Fetching the Accounts', action);
                state.isLoading = true;
            })
            .addMatcher(accountingApi.endpoints.getAccounts.matchFulfilled, (state, action) => {
                logger.info('Received the Accounts', action);
                state.accounts = action.payload;

                const accountSelectOptions = map(
                    groupBy(
                        action.payload,
                        (a: Account): string => a.accountType.name,
                    ),
                    (accounts, categoryName): AccountCategoryList => ({
                        category: categoryName,
                        accounts: accounts.map((a: Account): AccountSelectOption => ({
                            id: a.id,
                            name: `${a.accountNumber} - ${a.name}`,
                        })),
                    }),
                );

                state.accountSelectOptions = accountSelectOptions;
                state.isLoading = false;
            })
            .addMatcher(accountingApi.endpoints.getAccounts.matchRejected, (state, action) => {
                logger.info('Error fetching the Accounts', action);
                state.isLoading = false;
            });
    },
    selectors: {
        selectAccounts: state => state.accounts,
        selectAccountSelectOptions: state => state.accountSelectOptions,
        selectIsLoadingAccounts: state => state.isLoading,
        selectSelectedAccount: state => state.selectedAccount,
    },
});

export default slice.reducer;

export const { setSelectedAccount } = slice.actions;

export const {
    selectAccounts,
    selectAccountSelectOptions,
    selectIsLoadingAccounts,
    selectSelectedAccount,
} = slice.selectors;
