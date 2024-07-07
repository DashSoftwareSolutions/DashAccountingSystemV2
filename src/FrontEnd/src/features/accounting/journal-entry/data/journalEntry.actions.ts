import ActionType from '../../../../app/store/actionType';
import IAction from '../../../../app/store/action.interface';
import {
    JournalEntry,
    JournalEntryAccount,
} from '../../models';

/* BEGIN: REST API Actions */
export interface RequestJournalEntryAction extends IAction {
    type: ActionType.REQUEST_JOURNAL_ENTRY;
};

export interface ReceiveJournalEntryAction extends IAction {
    type: ActionType.RECEIVE_JOURNAL_ENTRY;
    entry: JournalEntry;
}

export interface SaveNewJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_SAVE_NEW_JOURNAL_ENTRY;
}

export interface SaveNewJournalEntryResponseAction extends IAction {
    type: ActionType.NEW_JOURNAL_ENTRY_SAVE_COMPLETED;
    savedEntry: JournalEntry;
}

export interface SaveUpdatedJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_SAVE_UPDATED_JOURNAL_ENTRY;
}

export interface SaveUpdatedJournalEntryResponseAction extends IAction {
    type: ActionType.UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED;
    savedEntry: JournalEntry;
}

export interface PostJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_POST_JOURNAL_ENTRY;
}

export interface PostJournalEntryResponseAction extends IAction {
    type: ActionType.POST_JOURNAL_ENTRY_COMPLETED;
    savedEntry: JournalEntry;
}

export interface DeleteJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_DELETE_JOURNAL_ENTRY;
}

export interface DeleteJournalEntryResponseAction extends IAction {
    type: ActionType.DELETE_JOURNAL_ENTRY_COMPLETED;
}

// API Error Handling
export interface SaveJournalEntryErrorAction extends IAction {
    type: ActionType.SAVE_JOURNAL_ENTRY_ERROR;
}
/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
export interface InitializeNewJournalEntryAction extends IAction {
    type: ActionType.INITIALIZE_NEW_JOURNAL_ENTRY;
    tenantId: string; // GUID
}

export interface EditJournalEntryAction extends IAction {
    type: ActionType.EDIT_JOURNAL_ENTRY;
}

export interface UpdateEntryDateAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_ENTRY_DATE;
    entryDate: string | null; // Date as YYYY-MM-DD / `null` to clear out an existing value
}

export interface UpdatePostDateAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_POST_DATE;
    postDate: string | null; // Date as YYYY-MM-DD / `null` to clear out an existing value
}

export interface UpdateDescriptionAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_DESCRIPTION;
    description: string | null; // `null` can clean out an existing value
}

export interface UpdateNoteAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_NOTE;
    note: string | null; // `null` can clean out an existing value
}

export interface UpdateCheckNumberAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_CHECK_NUMBER;
    checkNumber: number | null; // unsigned integer / `null` can clean out an existing value
}

export interface AddAccountAction extends IAction {
    type: ActionType.ADD_JOURNAL_ENTRY_ACCOUNT;
    account: JournalEntryAccount;
}

export interface RemoveAccountAction extends IAction {
    type: ActionType.REMOVE_JOURNAL_ENTRY_ACCOUNT;
    accountId: string; // GUID / Account ID to remove
}

export interface UpdateAccountAmountAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT;
    accountId: string; // GUID / Account ID to update
    amount: number | null; // New Account Amount (positive for Debit; negative for Credit) / `null` to clear existing value
    amountAsString: string | null; // New Account Amount as originally entered
}

/* END: UI Gesture Actions */

export interface ResetDirtyEntryAction extends IAction {
    type: ActionType.RESET_DIRTY_JOURNAL_ENTRY;
}

export interface ResetStateAction extends IAction {
    type: ActionType.RESET_JOURNAL_ENTRY_STORE_STATE;
};

export type KnownAction = RequestJournalEntryAction |
    ReceiveJournalEntryAction |
    SaveNewJournalEntryRequestAction |
    SaveNewJournalEntryResponseAction |
    SaveUpdatedJournalEntryRequestAction |
    SaveUpdatedJournalEntryResponseAction |
    PostJournalEntryRequestAction |
    PostJournalEntryResponseAction |
    DeleteJournalEntryRequestAction |
    DeleteJournalEntryResponseAction |
    SaveJournalEntryErrorAction |
    InitializeNewJournalEntryAction |
    EditJournalEntryAction |
    UpdateEntryDateAction |
    UpdatePostDateAction |
    UpdateDescriptionAction |
    UpdateNoteAction |
    UpdateCheckNumberAction |
    AddAccountAction |
    RemoveAccountAction |
    UpdateAccountAmountAction |
    ResetDirtyEntryAction |
    ResetStateAction;
