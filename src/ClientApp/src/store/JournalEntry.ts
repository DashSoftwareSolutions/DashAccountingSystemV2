import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import {
    cloneDeep,
    filter,
    findIndex,
    groupBy,
    isEmpty,
    isNil,
    keys,
    map,
    reduce,
    trim,
} from 'lodash';
import { AppThunkAction } from './';
import { isStringNullOrWhiteSpace } from '../common/StringUtils';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import Amount from '../models/Amount';
import AmountType from '../models/AmountType';
import IAction from './IAction';
import JournalEntry from '../models/JournalEntry';
import JournalEntryAccount from '../models/JournalEntryAccount';

export interface JournalEntryAccountsValidationState {
    error: string;
    hasMixedAssetTypes: boolean;
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

const DEFAULT_ACCOUNT_VALIDATION_STATE: JournalEntryAccountsValidationState = {
    error: '',
    hasMixedAssetTypes: false,
    hasSufficientAccounts: false,
    isBalanced: true,
};

const DEFAULT_VALIDATION_STATE: JournalEntryValidationState = {
    accounts: { ...DEFAULT_ACCOUNT_VALIDATION_STATE },
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
    isDeleting: boolean;
    existingEntry: JournalEntry | null;
    dirtyEntry: JournalEntry | null;
    totalCredits: number,
    totalDebits: number,
    validation: JournalEntryValidationState;
}

/* BEGIN: REST API Actions */
interface RequestJournalEntryAction extends IAction {
    type: ActionType.REQUEST_JOURNAL_ENTRY;
};

interface ReceiveJournalEntryAction extends IAction {
    type: ActionType.RECEIVE_JOURNAL_ENTRY;
    entry: JournalEntry;
}

interface SaveNewJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_SAVE_NEW_JOURNAL_ENTRY;
}

interface SaveNewJournalEntryResponseAction extends IAction {
    type: ActionType.NEW_JOURNAL_ENTRY_SAVE_COMPLETED;
    savedEntry: JournalEntry;
}

interface SaveUpdatedJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_SAVE_UPDATED_JOURNAL_ENTRY;
}

interface SaveUpdatedJournalEntryResponseAction extends IAction {
    type: ActionType.UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED;
    savedEntry: JournalEntry;
}

interface PostJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_POST_JOURNAL_ENTRY;
}

interface PostJournalEntryResponseAction extends IAction {
    type: ActionType.POST_JOURNAL_ENTRY_COMPLETED;
    savedEntry: JournalEntry;
}

interface DeleteJournalEntryRequestAction extends IAction {
    type: ActionType.REQUEST_DELETE_JOURNAL_ENTRY;
}

interface DeleteJournalEntryResponseAction extends IAction {
    type: ActionType.DELETE_JOURNAL_ENTRY_COMPLETED;
}

// API Error Handling
interface SaveJournalEntryErrorAction extends IAction {
    type: ActionType.SAVE_JOURNAL_ENTRY_ERROR,
}

/* END: REST API Actions */

/* BEGIN: UI Gesture Actions */
interface InitializeNewJournalEntryAction extends IAction {
    type: ActionType.INITIALIZE_NEW_JOURNAL_ENTRY;
    tenantId: string; // GUID
}

interface EditJournalEntryAction extends IAction {
    type: ActionType.EDIT_JOURNAL_ENTRY;
}

interface UpdateEntryDateAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_ENTRY_DATE;
    entryDate: string | null; // Date as YYYY-MM-DD / `null` to clear out an existing value
}

interface UpdatePostDateAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_POST_DATE;
    postDate: string | null; // Date as YYYY-MM-DD / `null` to clear out an existing value
}

interface UpdateDescriptionAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_DESCRIPTION;
    description: string | null; // `null` can clean out an existing value
}

interface UpdateNoteAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_NOTE;
    note: string | null; // `null` can clean out an existing value
}

interface UpdateCheckNumberAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_CHECK_NUMBER;
    checkNumber: number | null; // unsigned integer / `null` can clean out an existing value
}

interface AddAccountAction extends IAction {
    type: ActionType.ADD_JOURNAL_ENTRY_ACCOUNT;
    account: JournalEntryAccount;
}

interface RemoveAccountAction extends IAction {
    type: ActionType.REMOVE_JOURNAL_ENTRY_ACCOUNT;
    accountId: string; // GUID / Account ID to remove
}

interface UpdateAccountAmountAction extends IAction {
    type: ActionType.UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT;
    accountId: string; // GUID / Account ID to update
    amount: number | null; // New Account Amount (positive for Debit; negative for Credit) / `null` to clear existing value
    amountAsString: string | null; // New Account Amount as originally entered
}
/* END: UI Gesture Actions */

interface ResetDirtyEntryAction extends IAction {
    type: ActionType.RESET_DIRTY_JOURNAL_ENTRY;
}

interface ResetStateAction extends IAction {
    type: ActionType.RESET_JOURNAL_ENTRY_STORE_STATE;
};

type KnownAction = RequestJournalEntryAction |
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

const DEFAULT_ACCOUNT_AMOUNT: Amount = {
    amount: null,
    amountAsString: null,
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

        dispatch({ type: ActionType.INITIALIZE_NEW_JOURNAL_ENTRY, tenantId });
    },

    editJournalEntry: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.EDIT_JOURNAL_ENTRY });
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
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<JournalEntry>
                })
                .then(entry => {
                    if (!isNil(entry)) {
                        dispatch({ type: ActionType.RECEIVE_JOURNAL_ENTRY, entry });
                    }
                });

            dispatch({ type: ActionType.REQUEST_JOURNAL_ENTRY });
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
                    apiErrorHandler
                        .handleError(response, dispatch as Dispatch<IAction>)
                        .then(() => { dispatch({ type: ActionType.SAVE_JOURNAL_ENTRY_ERROR }); });

                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({ type: ActionType.NEW_JOURNAL_ENTRY_SAVE_COMPLETED, savedEntry });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_JOURNAL_ENTRY });
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
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({ type: ActionType.POST_JOURNAL_ENTRY_COMPLETED, savedEntry });
                }
            });

        dispatch({ type: ActionType.REQUEST_POST_JOURNAL_ENTRY });
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
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({ type: ActionType.UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED, savedEntry });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_UPDATED_JOURNAL_ENTRY });
    },

    deleteJournalEntry: (entryId: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.tenants?.selectedTenant?.id;
        const accessToken = await authService.getAccessToken();

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`api/journal/${tenantId}/entry/${entryId}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return;
                }

                dispatch({ type: ActionType.DELETE_JOURNAL_ENTRY_COMPLETED });
            });

        dispatch({ type: ActionType.REQUEST_DELETE_JOURNAL_ENTRY });
    },

    updateEntryDate: (entryDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_JOURNAL_ENTRY_ENTRY_DATE, entryDate });
    },

    updatePostDate: (postDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_JOURNAL_ENTRY_POST_DATE, postDate });
    },

    updateDescription: (description: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_JOURNAL_ENTRY_DESCRIPTION, description });
    },

    updateNote: (note: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_JOURNAL_ENTRY_NOTE, note });
    },

    updateCheckNumber: (checkNumber: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.UPDATE_JOURNAL_ENTRY_CHECK_NUMBER, checkNumber });
    },

    addAccount: (account: JournalEntryAccount): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.ADD_JOURNAL_ENTRY_ACCOUNT, account });
    },

    removeAccount: (accountId: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.REMOVE_JOURNAL_ENTRY_ACCOUNT, accountId });
    },

    updateAccountAmount: (accountId: string, amountAsString: string | null, amount: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT,
            accountId,
            amountAsString,
            amount,
        });
    },

    resetDirtyEditorState: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_DIRTY_JOURNAL_ENTRY });
    },

    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_JOURNAL_ENTRY_STORE_STATE });
    },
};

const unloadedState: JournalEntryState = {
    isLoading: false,
    isSaving: false,
    isDeleting: false,
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

// Helper function for checking two numbers for equality
// 'cause ... you know ... floating point number issues! ;-)
// Adapted from: https://stackoverflow.com/a/49261488
const defaultPrecision = 0.001;
const numbersAreEqualWithPrecision = (n1: number, n2: number, precision: number = defaultPrecision): boolean => {
    return Math.abs(n1 - n2) <= precision;
}

const updateStateAfterAccountChange = (state: JournalEntryState, updatedJournalEntry: JournalEntry): JournalEntryState => {
    let accountValidation: JournalEntryAccountsValidationState = { ...DEFAULT_ACCOUNT_VALIDATION_STATE };

    // Validate that we have at least two accounts in the journal entry/transaction
    accountValidation.hasSufficientAccounts = updatedJournalEntry.accounts.length >= 2;

    if (!accountValidation.hasSufficientAccounts) {
        accountValidation.error = updatedJournalEntry.accounts.length === 0 ?
            'Journal Entry does not have any accounts' :
            'Journal Entry must have at least two accounts';
    }

    // Assuming we have a sufficient number of accounts, let's verify that the amounts are all of the same asset type (currency)
    if (accountValidation.hasSufficientAccounts) {
        const groupedByAssetType = groupBy(updatedJournalEntry.accounts, (acct): number | null => acct.amount?.assetType?.id ?? null);
        accountValidation.hasMixedAssetTypes = keys(groupedByAssetType).length > 1;

        if (accountValidation.hasMixedAssetTypes) {
            accountValidation.error = 'Journal Entry has mixed asset types';
        }
    }

    // TODO: Foreign currency transactions! (see https://github.com/DashSoftwareSolutions/DashAccountingSystemV2/issues/32)
    //       Need to detect if the asset type of the transaction is not the same as the tenant's default asset type.
    //       Then pop some modal open to show user what is happening, fetch the appropriate conversion rate,
    //       and convert the foreign currency amounts into amounts denominated in tenant's default currency.

    //       Note that the model for a "JournalEntryAccount" will change to be able to persist the foreign currency amount
    //       and the conversion rate used; the normal amount property will _always_ be in the tenant's default currency.

    //       This is because it is _ABSOLUTELY NECESSARY_ that all transactions are in same currency
    //       in order to produce statements like the Balance Sheet and Profit & Loss -- everything has to be properly additive!

    // Sum the Debits and Credits
    const totalDebits = sumDebits(updatedJournalEntry.accounts);
    const totalCredits = sumCredits(updatedJournalEntry.accounts);

    // Check if the entry is balanced
    accountValidation.isBalanced = accountValidation.hasSufficientAccounts &&
        !accountValidation.hasMixedAssetTypes &&
        numbersAreEqualWithPrecision(totalDebits, totalCredits); // cannot use totalDebits === totalCredits due to floating point precision issues

    if (!accountValidation.isBalanced) {
        accountValidation.error = 'Journal Entry is not balanced';
    }

    // Return the updated state
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
            case ActionType.REQUEST_JOURNAL_ENTRY:
                return {
                    ...state,
                    isLoading: true,
                };

            case ActionType.RECEIVE_JOURNAL_ENTRY:
                return {
                    ...state,
                    isLoading: false,
                    existingEntry: action.entry,
                };

            case ActionType.REQUEST_POST_JOURNAL_ENTRY:
            case ActionType.REQUEST_SAVE_NEW_JOURNAL_ENTRY:
            case ActionType.REQUEST_SAVE_UPDATED_JOURNAL_ENTRY:
                return {
                    ...state,
                    isSaving: true,
                };

            case ActionType.NEW_JOURNAL_ENTRY_SAVE_COMPLETED:
            case ActionType.UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED:
            case ActionType.POST_JOURNAL_ENTRY_COMPLETED:
                return {
                    ...state,
                    isSaving: false,
                    existingEntry: action.savedEntry,
                };

            case ActionType.SAVE_JOURNAL_ENTRY_ERROR:
                return {
                    ...state,
                    isSaving: false,
                };

            case ActionType.REQUEST_DELETE_JOURNAL_ENTRY:
                return {
                    ...state,
                    isDeleting: true,
                };

            case ActionType.DELETE_JOURNAL_ENTRY_COMPLETED:
                return unloadedState;

            case ActionType.INITIALIZE_NEW_JOURNAL_ENTRY:
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

            case ActionType.EDIT_JOURNAL_ENTRY: {
                const { existingEntry } = state;

                if (isNil(existingEntry)) {
                    logger.warn('Existing Journal Entry was null');
                    return state;
                }

                const dirtyEntry = cloneDeep(state.existingEntry) ?? { ...DEFAULT_JOURNAL_ENTRY };

                dirtyEntry.accounts = map(dirtyEntry.accounts, (acct) => ({
                    ...acct,
                    amount: {
                        ...acct.amount as Pick<Amount, keyof Amount>,
                        amountAsString: ((acct?.amount?.amountType === AmountType.Credit ? (acct?.amount?.amount ?? 0) * -1 : acct?.amount?.amount) ?? 0).toString(),
                    },
                }));

                return updateStateAfterAccountChange(state, dirtyEntry);
            }

            case ActionType.UPDATE_JOURNAL_ENTRY_ENTRY_DATE:
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        entryDate: action.entryDate,
                    },
                };

            case ActionType.UPDATE_JOURNAL_ENTRY_POST_DATE:
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        postDate: action.postDate,
                    },
                };

            case ActionType.UPDATE_JOURNAL_ENTRY_DESCRIPTION:
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        description: action.description,
                    },
                };

            case ActionType.UPDATE_JOURNAL_ENTRY_NOTE:
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        note: action.note,
                    },
                };

            case ActionType.UPDATE_JOURNAL_ENTRY_CHECK_NUMBER:
                return {
                    ...state,
                    dirtyEntry: {
                        ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                        checkNumber: action.checkNumber,
                    },
                };

            case ActionType.ADD_JOURNAL_ENTRY_ACCOUNT: {
                const updatedJournalEntry: JournalEntry = {
                    ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                    accounts: [
                        ...state.dirtyEntry?.accounts ?? [],
                        action.account,
                    ],
                };

                return updateStateAfterAccountChange(state, updatedJournalEntry);
            }

            case ActionType.REMOVE_JOURNAL_ENTRY_ACCOUNT: {
                const updatedJournalEntry: JournalEntry = {
                    ...state.dirtyEntry as Pick<JournalEntry, keyof JournalEntry>,
                    accounts: filter(
                        state.dirtyEntry?.accounts,
                        (a: JournalEntryAccount): boolean => a.accountId !== action.accountId,
                    ),
                };

                return updateStateAfterAccountChange(state, updatedJournalEntry);
            }

            case ActionType.UPDATE_JOURNAL_ENTRY_ACCOUNT_AMOUNT: {
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
                updatedAccountAmount.amountAsString = action.amountAsString;
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

            case ActionType.RESET_DIRTY_JOURNAL_ENTRY:
                return {
                    ...state,
                    dirtyEntry: null,
                    totalCredits: 0,
                    totalDebits: 0,
                    validation: { ...DEFAULT_VALIDATION_STATE },
                };

            case ActionType.RESET_JOURNAL_ENTRY_STORE_STATE:
                return unloadedState;
        }
    }

    return state;
}