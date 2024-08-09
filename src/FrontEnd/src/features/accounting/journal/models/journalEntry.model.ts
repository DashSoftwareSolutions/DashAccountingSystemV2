import JournalEntryAccount from './journalEntryAccount.model';
import { TransactionStatus } from '../../../../common/models';

export default interface JournalEntry {
    tenantId: string | null; // GUID (required to create)
    id: string | null; // GUID (not required to created - assigned by system)
    entryId: number | null; // unsigned integer (not required to create - assigned by system)
    status: TransactionStatus | null; // (not required to create - assigned by system)
    entryDate: string | null; // Date - YYYY-MM-DD (required)
    postDate: string | null; // Nullable Date - YYYY-MM-DD (optional to create Journal Entry in 'Posted' status)
    description: string | null; // required
    note: string | null; // optional
    checkNumber: number | null; // optional
    accounts: JournalEntryAccount[];
}
