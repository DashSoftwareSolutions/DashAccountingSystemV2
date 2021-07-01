import { Action, Reducer } from 'redux';
import {
    cloneDeep,
    filter,
    findIndex,
    isEmpty,
    isNil,
    map,
    reduce,
    trim,
} from 'lodash';
import { AppThunkAction } from './';
import { isStringNullOrWhiteSpace } from '../common/StringUtils';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import AmountType from '../models/AmountType';
import JournalEntry from '../models/JournalEntry';
import JournalEntryAccount from '../models/JournalEntryAccount';

export interface JournalEntryAccountsValidationState {
    error: string;
    hasSufficientAccounts: boolean;
    isBalanced: boolean;
}

export interface JournalEntryAttributeValidationState {
    valid: boolean | undefined;
    invalid: boolean | undefined;
    error: string | null;
}

const DEFAULT_ATTRIBUTE_VALIDATION_STATE: JournalEntryAttributeValidationState = {
    error: null,
    valid: undefined,
    invalid: undefined,
};

interface JournalEntryValidationState {
    accounts: JournalEntryAccountsValidationState;
    attributes: Map<string, JournalEntryAttributeValidationState>;
    canSave: boolean;
}

const DEFAULT_VALIDATION_STATE: JournalEntryValidationState = {
    accounts: { error: '', hasSufficientAccounts: false, isBalanced: true },
    attributes: new Map([
        ['entryDate', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['postDate', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['description', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['note', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
        ['checkNumber', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
    ]),
    canSave: false,
};

export interface JournalEntryState {
    isLoading: boolean;
    isSaving: boolean;
    existingEntry: JournalEntry | null;
    dirtyEntry: JournalEntry | null;
    totalCredits: number,
    totalDebits: number,
    validation: JournalEntryValidationState;
}

/* BEGIN: REST API Actions */
interface RequestJournalEntryAction {
    type: 'REQUEST_JOURNAL_ENTRY';
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

interface EditJournalEntryAction {
    type: 'EDIT_JOURNAL_ENTRY';
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

interface ResetDirtyEntryAction {
    type: 'RESET_DIRTY_JOURNAL_ENTRY';
}

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

    editJournalEntry: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'EDIT_JOURNAL_ENTRY' });
    },

    requestJournalEntry: (entryId: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;

        if (isNil(tenantId)) {
            logger.warn('No selected Tenant.  Cannot fetch Journal Entry');
            return;
        }

        const existingEntry = appState.journalEntry?.existingEntry;
        const isFetching = appState.journalEntry?.isLoading ?? false;

        if (!isFetching && (isNil(existingEntry) || existingEntry?.entryId !== entryId)) {
            const accessToken = await authService.getAccessToken();

            fetch(`api/journal/${tenantId}/entry/${entryId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response);
                        return null;
                    }

                    return response.json() as Promise<JournalEntry>
                })
                .then(entry => {
                    if (!isNil(entry)) {
                        dispatch({ type: 'RECEIVE_JOURNAL_ENTRY', entry });
                    }
                });

            dispatch({ type: 'REQUEST_JOURNAL_ENTRY' });
            return;
        }

        logger.debug('We seem to have already fetch Journal Entry ID', entryId);
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
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response);
                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({ type: 'NEW_JOURNAL_ENTRY_SAVE_COMPLETED', savedEntry });
                }
            });

        dispatch({ type: 'REQUEST_SAVE_NEW_JOURNAL_ENTRY' });
    },

    postJournalEntry: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;
        const entryToSave = appState.journalEntry?.dirtyEntry;

        if (isNil(entryToSave)) {
            logger.warn('No Journal Entry found in store state.  Bailing out.');
            return;
        }

        const accessToken = await authService.getAccessToken();

        const putBody = {
            postDate: entryToSave.postDate,
            note: !isStringNullOrWhiteSpace(entryToSave.note) ? trim(entryToSave.note ?? '') : undefined,
        };

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(putBody),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`api/journal/${tenantId}/entry/${entryToSave.entryId}/post-date`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response);
                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({ type: 'POST_JOURNAL_ENTRY_COMPLETED', savedEntry });
                }
            });

        dispatch({ type: 'REQUEST_POST_JOURNAL_ENTRY' });
    },

    updateJournalEntry: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;
        const entryToSave = appState.journalEntry?.dirtyEntry;

        if (isNil(entryToSave)) {
            logger.warn('No Journal Entry found in store state.  Bailing out.');
            return;
        }

        const accessToken = await authService.getAccessToken();

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(entryToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`api/journal/${tenantId}/entry/${entryToSave.entryId}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response);
                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({ type: 'UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED', savedEntry });
                }
            });

        dispatch({ type: 'REQUEST_SAVE_UPDATED_JOURNAL_ENTRY' });
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

    resetDirtyEditorState: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'RESET_DIRTY_JOURNAL_ENTRY' });
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
    totalCredits: 0,
    totalDebits: 0,
    validation: { ...DEFAULT_VALIDATION_STATE },
};

const areAllRequiredAttributesSet = (journalEntry: JournalEntry): boolean => {
    return !isStringNullOrWhiteSpace(journalEntry.description) &&
        !isNil(journalEntry.entryDate);
};

const sumCredits = (accounts: JournalEntryAccount[]): number => {
    return reduce(
        map(
            filter(
                accounts,
                (a) => a?.amount?.amountType === AmountType.Credit,
            ),
            (a) => (a?.amount?.amount ?? 0) * -1,
        ),
        (sum, next) => sum + next,
        0);
};

const sumDebits = (accounts: JournalEntryAccount[]): number => {
    return reduce(
        map(
            filter(
                accounts,
                (a) => a?.amount?.amountType === AmountType.Debit,
            ),
            (a) => a?.amount?.amount ?? 0,
        ),
        (sum, next) => sum + next,
        0);
};

const updateStateAfterAccountChange = (state: JournalEntryState, updatedJournalEntry: JournalEntry): JournalEntryState => {
    let accountValidation: JournalEntryAccountsValidationState = { hasSufficientAccounts: false, isBalanced: true, error: '' };

    // TODO: Right now, we are assuming all amounts are using same asset type (e.g. USD $, etc.)
    //       If entry were to have mixed asset types, each group of amounts by asset type must balance.
    //       Honestly, though, we might want to hide Asset Type and assume that all transactions against an account must be of same asset type.
    //       Definitely no Asset Type exposed for every Journal Entry in QuickBooks; it is likely some global setting somewhere.

    const totalDebits = sumDebits(updatedJournalEntry.accounts);
    const totalCredits = sumCredits(updatedJournalEntry.accounts);

    accountValidation.hasSufficientAccounts = updatedJournalEntry.accounts.length >= 2;

    if (!accountValidation.hasSufficientAccounts) {
        accountValidation.error = updatedJournalEntry.accounts.length === 0 ?
            'Journal Entry does not have any accounts' :
            'Journal Entry must have at least two accounts';
    }

    accountValidation.isBalanced = accountValidation.hasSufficientAccounts && totalDebits === totalCredits;

    if (!accountValidation.isBalanced) {
        accountValidation.error = 'Journal Entry is not balanced';
    }

    return {
        ...state,
        dirtyEntry: updatedJournalEntry,
        validation: {
            ...state.validation,
            accounts: accountValidation,
            canSave: isEmpty(accountValidation.error) && areAllRequiredAttributesSet(updatedJournalEntry),
        },
        totalCredits,
        totalDebits,
    };
};

export const reducer: Reducer<JournalEntryState> = (state: JournalEntryState | undefined, incomingAction: Action): JournalEntryState => {
    if (state === undefined) {
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
                    validation: { ...DEFAULT_VALIDATION_STATE },
                };

            case 'EDIT_JOURNAL_ENTRY': {
                const { existingEntry } = state;

                if (isNil(existingEntry)) {
                    logger.warn('Existing Journal Entry was null');
                    return state;
                }

                const dirtyEntry = cloneDeep(state.existingEntry) ?? { ...DEFAULT_JOURNAL_ENTRY };
                return updateStateAfterAccountChange(state, dirtyEntry);
            }

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

            case 'ADD_JOURNAL_ENTRY_ACCOUNT': {
                const updatedJournalEntry: JournalEntry = {
                    ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                    accounts: [
                        ...state.dirtyEntry?.accounts ?? [],
                        action.account,
                    ],
                };

                return updateStateAfterAccountChange(state, updatedJournalEntry);
            }

            case 'REMOVE_JOURNAL_ENTRY_ACCOUNT': {
                const updatedJournalEntry: JournalEntry = {
                    ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                    accounts: filter(
                        state.dirtyEntry?.accounts,
                        (a: JournalEntryAccount): boolean => a.accountId !== action.accountId,
                    ),
                };

                return updateStateAfterAccountChange(state, updatedJournalEntry);
            }

            case 'UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT': {
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

                return updateStateAfterAccountChange(state, updatedDirtyEntry);
            }

            case 'RESET_DIRTY_JOURNAL_ENTRY':
                return {
                    ...state,
                    dirtyEntry: null,
                    totalCredits: 0,
                    totalDebits: 0,
                    validation: { ...DEFAULT_VALIDATION_STATE },
                };

            case 'RESET_JOURNAL_ENTRY_STORE_STATE':
                return unloadedState;
        }
    }

    return state;
}