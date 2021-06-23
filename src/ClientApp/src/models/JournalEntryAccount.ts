import Amount from './Amount';

export default interface JournalEntryAccount {
    accountId: string | null;
    accountNumber: number | null;
    accountName: string | null;
    amount: Amount | null;
}