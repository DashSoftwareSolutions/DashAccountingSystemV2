import AccountType from './AccountType';
import Amount from './Amount';
import AmountType from './AmountType';
import AssetType from './AssetType';
import LedgerAccountTransaction from './LedgerAccountTransaction';

export default interface LedgerAccount {
    id: string; // GUID
    accountNumber: number; // unsigned short
    name: string;
    description: string;
    accountType: AccountType;
    assetType: AssetType;
    normalBalanceType: AmountType; // "Debit" or "Credit"
    startingBalance: Amount;
    transactions: LedgerAccountTransaction[];
}