import AccountSubType from './accountSubType.model';
import AccountType from './accountType.model';

/**
 * Lite version of an Account object.
 */
export default interface AccountLite {
    /**
     * Account ID (GUID)
     */
    id: string;
    /**
     * Account Number (unsigned [positive] short integer)
     */
    accountNumber: number;
    /**
     * Account Name
     */
    accountName: string;
    /**
     * Account Type
     */
    accountType: AccountType;
    /**
     * Account Sub Type
     */
    accountSubType: AccountSubType;
}
