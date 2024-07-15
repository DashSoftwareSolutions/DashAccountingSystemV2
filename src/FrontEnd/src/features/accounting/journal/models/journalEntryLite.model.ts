import {
    DateTimeString,
    TransactionStatus
} from '../../../../common/models';

export default interface JournalEntryLite {
    id: string; // GUID
    entryId: number; // unsigned integer
    status: TransactionStatus;
    entryDate: DateTimeString; // Date - YYYY-MM-DD
    postDate: DateTimeString | null; // Nullable Date - YYYY-MM-DD
    description: string;
}
