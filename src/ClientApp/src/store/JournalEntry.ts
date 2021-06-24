import { Action, Reducer } from 'redux';
import {
    filter,
    findIndex,
    isEmpty,
    isNil,

} from 'lodash';
import { AppThunkAction } from './';
import authService from '../components/api-authorization/AuthorizeService';
import AmountType from '../models/AmountType';
import JournalEntry from '../models/JournalEntry';
import JournalEntryAccount from '../models/JournalEntryAccount';
import { Logger } from '../common/Logging';

interface JournalEntryValidationState { // TODO: Validation might go into component state ... stay tuned ...
    error: string;
    hasSufficientAccounts: boolean;
    isBalanced: boolean;
}

export interface JournalEntryState {
    isLoading: boolean;
    isSaving: boolean;
    existingEntry: JournalEntry | null;
    dirtyEntry: JournalEntry | null;
    validationState: JournalEntryValidationState | null; // TODO: Validation might go into component state ... stay tuned ...
    // TODO: If handling 'Post a Pending Jounral Entry' separately (e.g. in a special modal or some such) define separate state for that if needed (if cannot use `dirtyEntry` for some reason)
}

/* BEGIN: REST API Actions */
interface RequestJournalEntryAction {
    type: 'REQUEST_JOURNAL_ENTRY';
    entryId: number; // unsigned integer
};

interface ReceiveJournalEntryAction {
    type: 'RECEIVE_JOURNAL_ENTRY';
    entry: JournalEntry;
}

interface SaveNewJournalEntryRequestAction {
    type: 'REQUEST_SAVE_NEW_JOURNAL_ENTRY';
}

interface SaveNewJournalEntryResponseAction {
    type: 'NEW_JOURNAL_ENTRY_SAVE_COMPLETED';
    savedEntry: JournalEntry;
}

interface SaveUpdatedJournalEntryRequestAction {
    type: 'REQUEST_SAVE_UPDATED_JOURNAL_ENTRY';
}

interface SaveUpdatedJournalEntryResponseAction {
    type: 'UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED';
    savedEntry: JournalEntry;
}

interface PostJournalEntryRequestAction {
    type: 'REQUEST_POST_JOURNAL_ENTRY';
}

interface PostJournalEntryResponseAction {
    type: 'POST_JOURNAL_ENTRY_COMPLETED';
    savedEntry: JournalEntry;
}

// TODO: Other CUD actions as needed, e.g. Delete, Cancel, etc.
// TODO: API Error Handling

/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
interface InitializeNewJournalEntryAction {
    type: 'INITIALIZE_NEW_JOURNAL_ENTRY';
    tenantId: string; // GUID
}

interface UpdateEntryDateAction {
    type: 'UPDATE_JOURNAL_ENTRY_ENTRY_DATE';
    entryDate: string | null; // Date as YYYY-MM-DD / `null` to clear out an existing value
}

interface UpdatePostDateAction {
    type: 'UPDATE_JOURNAL_ENTRY_POST_DATE';
    postDate: string | null; // Date as YYYY-MM-DD / `null` to clear out an existing value
}

interface UpdateDescriptionAction {
    type: 'UPDATE_JOURNAL_ENTRY_DESCRIPTION';
    description: string | null; // `null` can clean out an existing value
}

interface UpdateNoteAction {
    type: 'UPDATE_JOURNAL_ENTRY_NOTE';
    note: string | null; // `null` can clean out an existing value
}

interface UpdateCheckNumberAction {
    type: 'UPDATE_JOURNAL_ENTRY_CHECK_NUMBER';
    checkNumber: number | null; // unsigned integer / `null` can clean out an existing value
}

interface AddAccountAction {
    type: 'ADD_JOURNAL_ENTRY_ACCOUNT';
    account: JournalEntryAccount;
}

interface RemoveAccountAction {
    type: 'REMOVE_JOURNAL_ENTRY_ACCOUNT';
    accountId: string; // GUID / Account ID to remove
}

interface UpdateAccountAmountAction {
    type: 'UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT';
    accountId: string; // GUID / Account ID to update
    amount: number | null; // New Account Amount (positive for Debit; negative for Credit) / `null` to clear existing value
}
/* END: UI Gesture Actions */

interface ResetStateAction {
    type: 'RESET_JOURNAL_ENTRY_STORE_STATE';
};

type KnownAction = RequestJournalEntryAction |
    ReceiveJournalEntryAction |
    SaveNewJournalEntryRequestAction |
    SaveNewJournalEntryResponseAction |
    SaveUpdatedJournalEntryRequestAction |
    SaveUpdatedJournalEntryResponseAction |
    PostJournalEntryRequestAction |
    PostJournalEntryResponseAction |
    InitializeNewJournalEntryAction |
    UpdateEntryDateAction |
    UpdatePostDateAction |
    UpdateDescriptionAction |
    UpdateNoteAction |
    UpdateCheckNumberAction |
    AddAccountAction |
    RemoveAccountAction |
    UpdateAccountAmountAction |
    ResetStateAction;

const logger = new Logger('Journal Entry Store');

const DEFAULT_JOURNAL_ENTRY: JournalEntry = {
    tenantId: null,
    id: null,
    entryId: null,
    status: null,
    entryDate: null,
    postDate: null,
    description: null,
    note: null,
    checkNumber: null,
    accounts: [],
};

const DEFAULT_JOURNAL_ENTRY_ACCOUNT = {
    accountId: null,
    accountNumber: null,
    accountName: null,
    amount: null,
};

const DEFAULT_ACCOUNT_AMOUNT = {
    amount: null,
    assetType: null,
    amountType: null,
};

export const actionCreators = {
    initializeNewJournalEntry: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;

        if (isNil(tenantId)) {
            logger.warn('No selected Tenant.  Cannot create Journal Entry');
            return;
        }

        dispatch({ type: 'INITIALIZE_NEW_JOURNAL_ENTRY', tenantId });
    },

    saveNewJournalEntry: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const entryToSave = appState.journalEntry?.dirtyEntry;

        if (isNil(entryToSave)) {
            logger.warn('No Journal Entry found in store state.  Bailing out.');
            return;
        }

        const accessToken = await authService.getAccessToken();

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(entryToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('api/journal/entry', requestOptions)
            .then(response => response.json() as Promise<JournalEntry>)
            .then(savedEntry => {
                dispatch({ type: 'NEW_JOURNAL_ENTRY_SAVE_COMPLETED', savedEntry });
            });

        dispatch({ type: 'REQUEST_SAVE_NEW_JOURNAL_ENTRY' });
    },

    updateEntryDate: (entryDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_JOURNAL_ENTRY_ENTRY_DATE', entryDate });
    },

    updatePostDate: (postDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_JOURNAL_ENTRY_POST_DATE', postDate });
    },

    updateDescription: (description: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_JOURNAL_ENTRY_DESCRIPTION', description });
    },

    updateNote: (note: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_JOURNAL_ENTRY_NOTE', note });
    },

    updateCheckNumber: (checkNumber: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_JOURNAL_ENTRY_CHECK_NUMBER', checkNumber });
    },

    addAccount: (account: JournalEntryAccount): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'ADD_JOURNAL_ENTRY_ACCOUNT', account });
    },

    removeAccount: (accountId: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'REMOVE_JOURNAL_ENTRY_ACCOUNT', accountId });
    },

    updateAccountAmount: (accountId: string, amount: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT', accountId, amount });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'RESET_JOURNAL_ENTRY_STORE_STATE' });
    },
};

const unloadedState: JournalEntryState = {
    isLoading: false,
    isSaving: false,
    existingEntry: null,
    dirtyEntry: null,
    validationState: null,
};

export const reducer: Reducer<JournalEntryState> = (state: JournalEntryState | undefined, incomingAction: Action): JournalEntryState => {
    if (state === undefined) {
        logger.debug('initializing Journal Entry Store state');
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case 'REQUEST_JOURNAL_ENTRY':
                return {
                    ...state,
                    isLoading: true,
                };

            case 'RECEIVE_JOURNAL_ENTRY':
                return {
                    ...state,
                    isLoading: false,
                    existingEntry: action.entry,
                };

            case 'REQUEST_POST_JOURNAL_ENTRY':
            case 'REQUEST_SAVE_NEW_JOURNAL_ENTRY':
            case 'REQUEST_SAVE_UPDATED_JOURNAL_ENTRY':
                return {
                    ...state,
                    isSaving: true,
                };

            case 'NEW_JOURNAL_ENTRY_SAVE_COMPLETED':
            case 'UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED':
            case 'POST_JOURNAL_ENTRY_COMPLETED':
                return {
                    ...state,
                    isSaving: false,
                    existingEntry: action.savedEntry,
                };

            case 'INITIALIZE_NEW_JOURNAL_ENTRY':
                return {
                    ...state,
                    dirtyEntry: {
                        tenantId: action.tenantId,
                        id: null,
                        entryId: null,
                        status: null,
                        entryDate: null,
                        postDate: null,
                        description: null,
                        note: null,
                        checkNumber: null,
                        accounts: [],
                    },
                    validationState: null,
                };

            case 'UPDATE_JOURNAL_ENTRY_ENTRY_DATE':
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        entryDate: action.entryDate,
                    },
                };

            case 'UPDATE_JOURNAL_ENTRY_POST_DATE':
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        postDate: action.postDate,
                    },
                };

            case 'UPDATE_JOURNAL_ENTRY_DESCRIPTION':
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        description: action.description,
                    },
                };

            case 'UPDATE_JOURNAL_ENTRY_NOTE':
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        note: action.note,
                    },
                };

            case 'UPDATE_JOURNAL_ENTRY_CHECK_NUMBER':
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        checkNumber: action.checkNumber,
                    },
                };

            case 'ADD_JOURNAL_ENTRY_ACCOUNT':
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        accounts: [
                            ...state.dirtyEntry?.accounts ?? [],
                            action.account,
                        ],
                    },
                };

            case 'REMOVE_JOURNAL_ENTRY_ACCOUNT':
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        accounts: filter(
                            state.dirtyEntry?.accounts,
                            (a: JournalEntryAccount): boolean => a.accountId !== action.accountId,
                        ),
                    },
                };

            case 'UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT':
                {
                    const updatedDirtyEntry: JournalEntry = { ...(state.dirtyEntry ?? DEFAULT_JOURNAL_ENTRY) };
                    const existingAccounts = updatedDirtyEntry.accounts ?? [];

                    if (isEmpty(existingAccounts)) {
                        logger.warn('No existing accounts');
                        return state;
                    }

                    const indexOfSpecifiedAccount = findIndex(
                        existingAccounts,
                        (a: JournalEntryAccount): boolean => a.accountId === action.accountId,
                    );

                    if (indexOfSpecifiedAccount === -1) {
                        logger.warn(`Account with ID ${action.accountId} not presently in the accounts collection`)
                        return state;
                    }

                    const existingAccount = existingAccounts[indexOfSpecifiedAccount];
                    const updatedAccountAmount = existingAccount.amount ?? { ...DEFAULT_ACCOUNT_AMOUNT };
                    updatedAccountAmount.amount = action.amount;
                    updatedAccountAmount.amountType = !isNil(action.amount) ?
                        (action.amount >= 0 ? AmountType.Debit : AmountType.Credit) :
                        null;

                    const updatedAccount = {
                        ...existingAccount,
                        amount: updatedAccountAmount,
                    };

                    updatedDirtyEntry.accounts = [
                        ...existingAccounts.slice(0, indexOfSpecifiedAccount),
                        updatedAccount,
                        ...existingAccounts.slice(indexOfSpecifiedAccount + 1),
                    ];

                    return {
                        ...state,
                        dirtyEntry: updatedDirtyEntry,
                    };
                }

            case 'RESET_JOURNAL_ENTRY_STORE_STATE':
                return unloadedState;
        }
    }

    return state;
}