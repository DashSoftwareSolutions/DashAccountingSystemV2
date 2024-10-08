import LedgerAccountTransaction from './ledgerAccountTransaction.model';
import {
    Amount,
    AmountType,
    AssetType,
} from '../../../../common/models';
import { AccountType } from '../../chart-of-accounts/models';

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
