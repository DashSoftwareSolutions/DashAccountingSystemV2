import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import AccountSubType from '../models/AccountSubType';
import AccountType from '../models/AccountType';
import AssetType from '../models/AssetType';
import IAction from './IAction';
import TimeZone from '../models/TimeZone';

export interface LookupValuesState {
    isLoading: boolean;
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
    timeZones: TimeZone[];
}

interface RequestLookupValuesAction extends IAction {
    type: ActionType.REQUEST_LOOKUPS;
}

interface ReceiveLookupValuesAction extends IAction {
    type: ActionType.RECEIVE_LOOKUPS;
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
    timeZones: TimeZone[];
}

interface LookupsApiResponse {
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
    timeZones: TimeZone[];
}

type KnownAction = RequestLookupValuesAction | ReceiveLookupValuesAction;

export const actionCreators = {
    requestLookupValues: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.lookups) &&
            !appState.lookups.isLoading &&
            (isEmpty(appState.lookups.accountTypes) || isEmpty(appState.lookups?.assetTypes))) {
            const accessToken = await authService.getAccessToken();

            fetch('api/lookups', {
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

const unloadedState: LookupValuesState = {
    isLoading: false,
    accountTypes: [],
    accountSubTypes: [],
    assetTypes: [],
    timeZones: [],
};

export const reducer: Reducer<LookupValuesState> = (state: LookupValuesState | undefined, incomingAction: Action): LookupValuesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_LOOKUPS:
                return {
                    ...state,
                    isLoading: true
                };

            case ActionType.RECEIVE_LOOKUPS:
                return {
                    ...state,
                    isLoading: false,
                    accountTypes: action.accountTypes,
                    accountSubTypes: action.accountSubTypes,
                    assetTypes: action.assetTypes,
                    timeZones: action.timeZones,
                };
        }
    }

    return state;
}