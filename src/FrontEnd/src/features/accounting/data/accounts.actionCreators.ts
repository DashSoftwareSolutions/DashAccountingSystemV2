import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { AppThunkAction } from '../../../app/store';
import ActionType from '../../../app/store/actionType';
import IAction from '../../../app/store/iaction.interface';
import { Account } from '../models';
import { KnownAction } from './accounts.actions';
import { apiErrorHandler } from '../../../common/utilities/errorHandling';

const actionCreators = {
    requestAccounts: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.accounts) &&
            !isNil(appState?.bootstrap?.selectedTenant) &&
            !appState.accounts.isFetching &&
            isEmpty(appState.accounts.accounts)) {
            const tenantId = appState?.bootstrap?.selectedTenant?.id;

            fetch(`/api/ledger/${tenantId}/accounts`)
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
