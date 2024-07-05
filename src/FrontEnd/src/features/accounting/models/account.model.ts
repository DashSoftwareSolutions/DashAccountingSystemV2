import AccountSubType from './accountSubType.model';
import AccountType from './accountType.model';
import {
    Amount,
    AmountType,
    AssetType,
    DateTimeString,
    UserLite,
} from '../../../common/models';

/**
 * Account object (in the accounting sense of the word -- an Account within the Chart of Accounts/Ledger).
 */
export default interface Account {
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
    accountSubType: AccountSubType;
    assetType: AssetType;
    /**
     * Type of the Account's "Normal Balance" ("Debit" or "Credit")
     */
    normalBalanceType: AmountType;
    created: DateTimeString;
    createdBy: UserLite;
    updated: DateTimeString | null;
    updatedBy: UserLite | null;
    balance: Amount;
    isBalanceNormal: boolean;
}
