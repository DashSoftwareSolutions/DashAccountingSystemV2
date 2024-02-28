import {
    Amount,
    AmountType,
    AssetType,
    UserLite,
} from '../../../common/models';
import AccountSubType from './accountSubType.model';
import AccountType from './accountType.model';

export default interface Account {
    id: string; // GUID
    accountNumber: number; // unsigned short
    name: string;
    description: string;
    accountType: AccountType;
    accountSubType: AccountSubType;
    assetType: AssetType;
    normalBalanceType: AmountType; // "Debit" or "Credit"
    created: string; // UTC Date/Time
    createdBy: UserLite;
    updated: string | null; // UTC Date/Time
    updatedBy: UserLite | null;
    balance: Amount;
    isBalanceNormal: boolean;
}