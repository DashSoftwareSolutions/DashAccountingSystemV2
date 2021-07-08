import { Action, Reducer } from 'redux';
import {
    groupBy,
    isEmpty,
    isNil,
    map,
} from 'lodash';
import { AppThunkAction } from './';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import Account from '../models/Account';
import AccountCategoryList from '../models/AccountCategoryList';
import AccountSelectOption from '../models/AccountSelectOption';
import ActionType from './ActionType';
import IAction from './IAction';

export interface AccountsState {
    isLoading: boolean;
    accounts: Account[];
    accountSelectOptions: AccountCategoryList[];
    selectedAccount: Account | null,
}

interface RequestAccountsAction extends IAction {
    type: ActionType.REQUEST_ACCOUNTS;
}

interface ReceiveAccountsAction extends IAction {
    type: ActionType.RECEIVE_ACCOUNTS;
    accounts: Account[];
}

interface SelectAccountAction extends IAction {
    type: ActionType.SELECT_ACCOUNT;
    account: Account;
}

type KnownAction = RequestAccountsAction | ReceiveAccountsAction | SelectAccountAction;

export const actionCreators = {
    requestAccounts: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.accounts) &&
            !isNil(appState?.tenants?.selectedTenant) &&
            !appState.accounts.isLoading &&
            isEmpty(appState.accounts.accounts)) {
            const accessToken = await authService.getAccessToken();
            const tenantId = appState?.tenants?.selectedTenant?.id;

            fetch(`api/ledger/${tenantId}/accounts`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response);
                        return null;
                    }

                    return response.json() as Promise<Account[]>
                })
                .then(data => {
                    if (!isNil(data)) {
                        dispatch({ type: ActionType.RECEIVE_ACCOUNTS, accounts: data });
                    }
                });

            dispatch({ type: ActionType.REQUEST_ACCOUNTS });
        }
    },

    selectAccount: (account: Account): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.SELECT_ACCOUNT, account });
    }
};

const unloadedState: AccountsState = {
    isLoading: false,
    accounts: [],
    accountSelectOptions: [],
    selectedAccount: null,
};

export const reducer: Reducer<AccountsState> = (state: AccountsState | undefined, incomingAction: Action): AccountsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_ACCOUNTS:
                return {
                    ...state,
                    isLoading: true
                };

            case ActionType.RECEIVE_ACCOUNTS:
            {
                const accountSelectOptions = map(
                    groupBy(
                        action.accounts,
                        (a: Account): string => a.accountType.name,
                    ),
                    (accounts, categoryName): AccountCategoryList => ({
                        category: categoryName,
                        accounts: map(accounts, (a: Account): AccountSelectOption => ({
                            id: a.id,
                            name: `${a.accountNumber} - ${a.name}`,
                        })),
                    }),
                );

                return {
                    ...state,
                    accounts: action.accounts,
                    accountSelectOptions,
                    isLoading: false
                };
            }

            case ActionType.SELECT_ACCOUNT:
                return {
                    ...state,
                    selectedAccount: action.account,
                };
        }
    }

    return state;
}
