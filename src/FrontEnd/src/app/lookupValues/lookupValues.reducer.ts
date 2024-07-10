import { isNil } from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import ActionType from '../globalReduxStore/actionType';
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

export interface LookupValuesState {
    isFetching: boolean;
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
    paymentMethods: PaymentMethod[];
    timeZones: TimeZone[];
}

const unloadedState: LookupValuesState = {
    isFetching: false,
    accountTypes: [],
    accountSubTypes: [],
    assetTypes: [],
    paymentMethods: [],
    timeZones: [],
};

const reducer: Reducer<LookupValuesState> = (state: LookupValuesState | undefined, incomingAction: Action): LookupValuesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_LOOKUPS:
                return {
                    ...state,
                    isFetching: true
                };

            case ActionType.RECEIVE_LOOKUPS:
                return {
                    ...state,
                    isFetching: false,
                    accountTypes: action.accountTypes,
                    accountSubTypes: action.accountSubTypes,
                    assetTypes: action.assetTypes,
                    paymentMethods: action.paymentMethods,
                    timeZones: action.timeZones,
                };
        }
    }

    return state;
}

export default reducer;
