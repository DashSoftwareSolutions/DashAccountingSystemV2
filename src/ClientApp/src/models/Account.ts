import Amount from './Amount';
import LookupValue from './LookupValue';
import UserLite from './UserLite';

export default interface Account {
    id: string; // GUID
    accountNumber: number; // unsigned short
    name: string;
    description: string;
    accountType: LookupValue;
    assetType: LookupValue;
    normalBalanceType: string; // "Debit" or "Credit"
    created: string; // UTC Date/Time
    createdBy: UserLite;
    updated: string | null; // UTC Date/Time
    updatedBy: UserLite | null;
    balance: Amount;
    isBalanceNormal: boolean;
};