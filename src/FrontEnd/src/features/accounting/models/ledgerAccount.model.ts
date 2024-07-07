import {
    Amount,
    AmountType,
    AssetType,
} from '../../../common/models';
import AccountType from './accountType.model';
import LedgerAccountTransaction from './ledgerAccountTransaction.model';

/**
 * Represents an Account on the General Ledger
 */
export default interface LedgerAccount {
    /**
     * Account ID (GUID)
     */
    id: string;
    /**
     * Account Number (unsigned [positive] short integer)
     */
    accountNumber: number;
    name: string;
    description: string;
    accountType: AccountType;
    assetType: AssetType;
    /**
     * Type of the Account's "Normal Balance" ("Debit" or "Credit")
     */
    normalBalanceType: AmountType;
    startingBalance: Amount;
    transactions: LedgerAccountTransaction[];
}
