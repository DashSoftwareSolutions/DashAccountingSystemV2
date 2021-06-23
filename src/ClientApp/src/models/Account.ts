import Amount from './Amount';
import AccountType from './AccountType';
import AssetType from './AssetType';
import UserLite from './UserLite';

export default interface Account {
    id: string; // GUID
    accountNumber: number; // unsigned short
    name: string;
    description: string;
    accountType: AccountType;
    assetType: AssetType;
    normalBalanceType: string; // "Debit" or "Credit"
    created: string; // UTC Date/Time
    createdBy: UserLite;
    updated: string | null; // UTC Date/Time
    updatedBy: UserLite | null;
    balance: Amount;
    isBalanceNormal: boolean;
};