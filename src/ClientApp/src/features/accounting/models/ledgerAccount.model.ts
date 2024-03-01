import {
    Amount,
    AmountType,
    AssetType,
} from '../../../common/models';
import AccountType from './accountType.model';
import LedgerAccountTransaction from './ledgerAccountTransaction.model';

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