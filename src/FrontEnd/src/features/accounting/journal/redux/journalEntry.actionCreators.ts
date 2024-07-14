import {
    isNil,
    trim,
} from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './journalEntry.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    ILogger,
    Logger
} from '../../../../common/logging';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { isStringNullOrWhiteSpace } from '../../../../common/utilities/stringUtils';
import {
    JournalEntry,
    JournalEntryAccount,
} from '../models';

const logger: ILogger = new Logger('Journal Entry Actions');

const actionCreators = {
    initializeNewJournalEntry: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.application?.selectedTenant?.id;

        if (isNil(tenantId)) {
            logger.warn('No selected Tenant.  Cannot create Journal Entry');
            return;
        }

        dispatch({
            type: ActionType.INITIALIZE_NEW_JOURNAL_ENTRY,
            tenantId,
        });
    },

    editJournalEntry: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.EDIT_JOURNAL_ENTRY });
    },

    requestJournalEntry: (entryId: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const tenantId = appState.application?.selectedTenant?.id;
        const accessToken = appState.authentication.tokens?.accessToken;

        if (isNil(tenantId)) {
            logger.warn('No selected Tenant.  Cannot fetch Journal Entry');
            return;
        }

        const existingEntry = appState.journal?.existingEntry;
        const isFetching = appState.journal?.isFetching ?? false;

        if (!isFetching && (isNil(existingEntry) || existingEntry?.entryId !== entryId)) {
            fetch(`/api/journal/${tenantId}/entry/${entryId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>)
                        return null;
                    }

                    return response.json() as Promise<JournalEntry>
                })
                .then(entry => {
                    if (!isNil(entry)) {
                        dispatch({
                            type: ActionType.RECEIVE_JOURNAL_ENTRY,
                            entry,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_JOURNAL_ENTRY });
            return;
        }

        logger.debug('We seem to have already fetched Journal Entry ID', entryId);
    },

    saveNewJournalEntry: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const accessToken = appState.authentication.tokens?.accessToken;
        const entryToSave = appState.journal?.dirtyEntry;

        if (isNil(entryToSave)) {
            logger.warn('No Journal Entry found in store state.  Bailing out.');
            return;
        }

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(entryToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/journal/entry', requestOptions)
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>)
                        .then(() => {
                            dispatch({ type: ActionType.SAVE_JOURNAL_ENTRY_ERROR });
                        });

                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({
                        type: ActionType.NEW_JOURNAL_ENTRY_SAVE_COMPLETED,
                        savedEntry,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_NEW_JOURNAL_ENTRY });
    },

    postJournalEntry: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const accessToken = appState.authentication.tokens?.accessToken;
        const tenantId = appState.application?.selectedTenant?.id;
        const entryToSave = appState.journal?.dirtyEntry;

        if (isNil(entryToSave)) {
            logger.warn('No Journal Entry found in store state.  Bailing out.');
            return;
        }

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

        fetch(`/api/journal/${tenantId}/entry/${entryToSave.entryId}/post-date`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({
                        type: ActionType.POST_JOURNAL_ENTRY_COMPLETED,
                        savedEntry,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_POST_JOURNAL_ENTRY });
    },

    updateJournalEntry: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const accessToken = appState.authentication.tokens?.accessToken;
        const tenantId = appState.application?.selectedTenant?.id;
        const entryToSave = appState.journal?.dirtyEntry;

        if (isNil(entryToSave)) {
            logger.warn('No Journal Entry found in store state.  Bailing out.');
            return;
        }

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(entryToSave),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`/api/journal/${tenantId}/entry/${entryToSave.entryId}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    return null;
                }

                return response.json() as Promise<JournalEntry>;
            })
            .then(savedEntry => {
                if (!isNil(savedEntry)) {
                    dispatch({
                        type: ActionType.UPDATED_JOURNAL_ENTRY_SAVE_COMPLETED,
                        savedEntry,
                    });
                }
            });

        dispatch({ type: ActionType.REQUEST_SAVE_UPDATED_JOURNAL_ENTRY });
    },

    deleteJournalEntry: (entryId: number): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const accessToken = appState.authentication.tokens?.accessToken;
        const tenantId = appState.application?.selectedTenant?.id;

        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        fetch(`/api/journal/${tenantId}/entry/${entryId}`, requestOptions)
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
        dispatch({
            type: ActionType.UPDATE_JOURNAL_ENTRY_ENTRY_DATE,
            entryDate,
        });
    },

    updatePostDate: (postDate: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_JOURNAL_ENTRY_POST_DATE,
            postDate,
        });
    },

    updateDescription: (description: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_JOURNAL_ENTRY_DESCRIPTION,
            description,
        });
    },

    updateNote: (note: string | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_JOURNAL_ENTRY_NOTE,
            note,
        });
    },

    updateCheckNumber: (checkNumber: number | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.UPDATE_JOURNAL_ENTRY_CHECK_NUMBER,
            checkNumber,
        });
    },

    addAccount: (account: JournalEntryAccount): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.ADD_JOURNAL_ENTRY_ACCOUNT,
            account,
        });
    },

    removeAccount: (accountId: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: ActionType.REMOVE_JOURNAL_ENTRY_ACCOUNT,
            accountId,
        });
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

export default actionCreators;
