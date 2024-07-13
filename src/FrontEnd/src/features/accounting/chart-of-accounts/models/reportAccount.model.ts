import AccountSubType from './accountSubType.model';
import AccountType from './accountType.model';
import {
    Amount,
    AmountType,
    AssetType,
} from '../../../../common/models';

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
