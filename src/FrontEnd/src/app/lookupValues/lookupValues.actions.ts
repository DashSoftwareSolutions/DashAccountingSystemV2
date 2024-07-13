import {
    AssetType,
    TimeZone
} from '../../common/models';
import {
    AccountSubType,
    AccountType,
} from '../../features/accounting/chart-of-accounts/models';
import { PaymentMethod } from '../../features/invoicing/models';
import IAction from '../globalReduxStore/action.interface';
import ActionType from '../globalReduxStore/actionType';

export interface RequestLookupValuesAction extends IAction {
    type: ActionType.REQUEST_LOOKUPS;
}

export interface ReceiveLookupValuesAction extends IAction {
    type: ActionType.RECEIVE_LOOKUPS;
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
    paymentMethods: PaymentMethod[];
    timeZones: TimeZone[];
}

export type KnownAction = RequestLookupValuesAction | ReceiveLookupValuesAction;
