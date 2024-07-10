import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { AppThunkAction } from '../globalReduxStore';
import ActionType from '../globalReduxStore/actionType';
import IAction from '../globalReduxStore/action.interface';
import {
    AssetType,
    TimeZone
} from '../../common/models';
import {
    AccountSubType,
    AccountType,
} from '../../features/accounting/chart-of-accounts/models';
import { PaymentMethod } from '../../features/invoicing/models';
import { KnownAction } from './lookupValues.actions';
import { apiErrorHandler } from '../../common/utilities/errorHandling';

interface LookupsApiResponse {
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
    paymentMethods: PaymentMethod[];
    timeZones: TimeZone[];
}

const actionCreators = {
    requestLookupValues: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.lookups) &&
            !appState.lookups.isFetching &&
            (isEmpty(appState.lookups.accountTypes) || isEmpty(appState.lookups?.assetTypes)) &&
            !isEmpty(appState.authentication.tokens?.accessToken)) {
            const accessToken = appState.authentication.tokens?.accessToken;

            fetch('/api/lookups', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<LookupsApiResponse>
                })
                .then(data => {
                    if (!isNil(data)) {
                        dispatch({
                            type: ActionType.RECEIVE_LOOKUPS,
                            ...data,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_LOOKUPS });
        }
    },
}

export default actionCreators;
