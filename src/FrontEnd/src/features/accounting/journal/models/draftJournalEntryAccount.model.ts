import { AssetType } from '../../../../common/models';

/**
 * Represents a work-in-progress Journal Entry Account used by the Journal Entry Editor.
 */
export default interface DraftJournalEntryAccount {
    accountId: string | null;
    accountNumber: number | null;
    accountName: string | null;
    assetType: AssetType | null;
    credit: number | null;
    creditAsString: string | null;
    debit: number | null;
    debitAsString: string | null;
};
