import {
    groupBy,
    isNil,
    map,
} from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './accounts.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    Account,
    AccountCategoryList,
    AccountSelectOption,
} from '../models';

export interface AccountsState {
    isFetching: boolean;
    accounts: Account[];
    accountSelectOptions: AccountCategoryList[];
    selectedAccount: Account | null;
}

const unloadedState: AccountsState = {
    isFetching: false,
    accounts: [],
    accountSelectOptions: [],
    selectedAccount: null,
};

const reducer: Reducer<AccountsState> = (state: AccountsState | undefined, incomingAction: Action): AccountsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_ACCOUNTS:
                return {
                    ...state,
                    isFetching: true,
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
                        isFetching: false,
                    };
                }

            case ActionType.SELECT_ACCOUNT:
                return {
                    ...state,
                    selectedAccount: action.account,
                };
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
}

export default reducer;
