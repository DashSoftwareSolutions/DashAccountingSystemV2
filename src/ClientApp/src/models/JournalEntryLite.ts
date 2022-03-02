import TransactionStatus from './TransactionStatus';

export default interface JournalEntryLite {
    id: string; // GUID
    entryId: number; // unsigned integer
    status: TransactionStatus;
    entryDate: string; // Date - YYYY-MM-DD
    postDate: string | null; // Nullable Date - YYYY-MM-DD
    description: string;
}