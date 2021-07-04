import AccountSubType from './AccountSubType';
import AccountType from './AccountType';
import Amount from './Amount';
import AmountType from './AmountType';
import AssetType from './AssetType';

export default interface ReportAccount {
    id: string; // GUID
    accountNumber: number; // unsigned short
    name: string;
    description: string;
    accountType: AccountType;
    accountSubType: AccountSubType;
    assetType: AssetType;
    normalBalanceType: AmountType; // "Debit" or "Credit"
    balance: Amount;
}