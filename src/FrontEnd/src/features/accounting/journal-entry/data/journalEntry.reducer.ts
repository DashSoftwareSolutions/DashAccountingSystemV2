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
} from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import {
    ILogger,
    Logger
} from '../../../../common/logging';
import {
    Amount,
    AmountType,
} from '../../../../common/models';
import { numbersAreEqualWithPrecision } from '../../../../common/utilities/numericUtils';
import { isStringNullOrWhiteSpace } from '../../../../common/utilities/stringUtils';
import {
    JournalEntry,
    JournalEntryAccount,
} from '../../models';
import ActionType from '../../../../app/store/actionType';
import { KnownAction } from './journalEntry.actions';

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
    dirtyEntry: JournalEntry | null;
    existingEntry: JournalEntry | null;
    isDeleting: boolean;
    isFetching: boolean;
    isSaving: boolean;
    totalCredits: number,
    totalDebits: number,
    validation: JournalEntryValidationState;
}

const logger: ILogger = new Logger('Journal Entry Reducer');

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

const unloadedState: JournalEntryState = {
    dirtyEntry: null,
    existingEntry: null,
    isDeleting: false,
    isFetching: false,
    isSaving: false,
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

const reducer: Reducer<JournalEntryState> = (state: JournalEntryState | undefined, incomingAction: Action): JournalEntryState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_JOURNAL_ENTRY:
                return {
                    ...state,
                    isFetching: true,
                };

            case ActionType.RECEIVE_JOURNAL_ENTRY:
                return {
                    ...state,
                    isFetching: false,
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

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
}

export default reducer;
