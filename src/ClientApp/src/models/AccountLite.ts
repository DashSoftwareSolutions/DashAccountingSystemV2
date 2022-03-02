import AccountSubType from './AccountSubType';
import AccountType from './AccountType';

export default interface AccountLite {
    id: string; // GUID
    accountNumber: number; // unsigned short
    accountName: string;
    accountType: AccountType;
    accountSubType: AccountSubType;
}