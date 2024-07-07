import { Amount } from '../../../common/models';
import TransactionStatus from './transactionStatus.model';

export default interface LedgerAccountTransaction {
    id: string; // GUID
    entryId: number; // unsigned integer
    status: TransactionStatus;
    entryDate: string; // Date - YYYY-MM-DD (required)
    postDate: string | null; // Nullable Date - YYYY-MM-DD (date value for transactions in 'Posted' status; null for transactions in 'Pending' status)
    description: string | null; // required
    note: string | null; // optional
    checkNumber: number | null; // optional
    created: string; // UTC timestamp in ISO 8601 format
    updated: string | null; // nullable UTC timestamp in ISO 8601 format
    canceled: string | null; // nullable UTC timestamp in ISO 8601 format
    amount: Amount;
    updatedBalance: Amount;
}
