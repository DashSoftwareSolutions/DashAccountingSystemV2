import { Amount } from '../../../common/models';

export default interface JournalEntryAccount {
    accountId: string | null;
    accountNumber: number | null;
    accountName: string | null;
    amount: Amount | null;
}
