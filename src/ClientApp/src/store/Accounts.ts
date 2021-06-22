import { Action, Reducer } from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import authService from '../components/api-authorization/AuthorizeService';
import Account from '../models/Account';

export interface AccountsState {
    isLoading: boolean;
    accounts: Account[];
    selectedAccount: Account | null,
}

interface RequestAccountsAction {
    type: 'REQUEST_ACCOUNTS';
}

interface ReceiveAccountsAction {
    type: 'RECEIVE_ACCOUNTS';
    accounts: Account[];
}

interface SelectAccountAction {
    type: 'SELECT_ACCOUNT';
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
                .then(response => response.json() as Promise<Account[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_ACCOUNTS', accounts: data });
                });

            dispatch({ type: 'REQUEST_ACCOUNTS' });
        }
    },

    selectAccount: (account: Account): AppThunkAction<KnownAction> => (dispatch) => {
        console.log('Selected account:', account);
        dispatch({ type: 'SELECT_ACCOUNT', account });
    }
};

const unloadedState: AccountsState = { isLoading: false, accounts: [], selectedAccount: null };

export const reducer: Reducer<AccountsState> = (state: AccountsState | undefined, incomingAction: Action): AccountsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case 'REQUEST_ACCOUNTS':
                return {
                    ...state,
                    isLoading: true
                };

            case 'RECEIVE_ACCOUNTS':
                return {
                    ...state,
                    accounts: action.accounts,
                    isLoading: false
                };

            case 'SELECT_ACCOUNT':
                return {
                    ...state,
                    selectedAccount: action.account,
                };
        }
    }

    return state;
}
