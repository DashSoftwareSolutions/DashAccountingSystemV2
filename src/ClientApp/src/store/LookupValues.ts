import { Action, Reducer } from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import authService from '../components/api-authorization/AuthorizeService';
import AccountType from '../models/AccountType';
import AssetType from '../models/AssetType';

export interface LookupValuesState {
    isLoading: boolean;
    accountTypes: AccountType[] | null;
    assetTypes: AssetType[] | null;
}

interface RequestLookupValuesAction {
    type: 'REQUEST_LOOKUPS';
}

interface ReceiveLookupValuesAction {
    type: 'RECEIVE_LOOKUPS';
    accountTypes: AccountType[];
    assetTypes: AssetType[];
}

interface LookupsApiResponse {
    accountTypes: AccountType[];
    assetTypes: AssetType[];
}

type KnownAction = RequestLookupValuesAction | ReceiveLookupValuesAction;

export const actionCreators = {
    requestLookupValues: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.lookups) &&
            !appState.lookups.isLoading &&
            isEmpty(appState.lookups.accountTypes) || isEmpty(appState.lookups?.assetTypes)) {
            const accessToken = await authService.getAccessToken();

            fetch('api/lookups', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json() as Promise<LookupsApiResponse>)
                .then(data => {
                    const {
                        accountTypes,
                        assetTypes,
                    } = data;

                    dispatch({ type: 'RECEIVE_LOOKUPS', accountTypes, assetTypes });
                });

            dispatch({ type: 'REQUEST_LOOKUPS' });
        }
    },
}

const unloadedState: LookupValuesState = { isLoading: false, accountTypes: [], assetTypes: [] };

export const reducer: Reducer<LookupValuesState> = (state: LookupValuesState | undefined, incomingAction: Action): LookupValuesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case 'REQUEST_LOOKUPS':
                return {
                    ...state,
                    isLoading: true
                };

            case 'RECEIVE_LOOKUPS':
                return {
                    ...state,
                    accountTypes: action.accountTypes,
                    assetTypes: action.assetTypes,
                    isLoading: false
                };
        }
    }

    return state;
}