import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import ActionType from '../../../../app/globalReduxStore/actionType';
import IAction from '../../../../app/globalReduxStore/action.interface';
import { Account } from '../models';
import { KnownAction } from './accounts.actions';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';

const actionCreators = {
    requestAccounts: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.chartOfAccounts) &&
            !isNil(appState?.application?.selectedTenant) &&
            !appState.chartOfAccounts.isFetching &&
            isEmpty(appState.chartOfAccounts.accounts) &&
            !isEmpty(appState.authentication.tokens?.accessToken)) {
            const accessToken = appState.authentication.tokens?.accessToken;
            const tenantId = appState?.application?.selectedTenant?.id;

            fetch(`/api/ledger/${tenantId}/accounts`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>)
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
    },
};

export default actionCreators;
