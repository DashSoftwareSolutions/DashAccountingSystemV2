import { useDispatch } from 'react-redux';
import IAction from './action.interface';
import * as Accounts from '../../features/accounting/data';
import * as Authentication from '../authentication/data';
import * as Bootstrap from '../bootstrap'
import * as JournalEntry from '../../features/accounting/journal-entry/data';
import * as Ledger from '../../features/accounting/general-ledger/data';
import * as SystemNotifications from '../notifications';

/**
 * Redux state tree for the entire application
 */
export interface ApplicationState {
    accounts: Accounts.state,
    authentication: Authentication.state,
    bootstrap: Bootstrap.state,
    journalEntry: JournalEntry.state,
    ledger: Ledger.state,
    systemNotifications: SystemNotifications.state;
}

/**
 * All Redux Reducers
 */
export const reducers = {
    accounts: Accounts.reducer,
    authentication: Authentication.reducer,
    bootstrap: Bootstrap.reducer,
    journalEntry: JournalEntry.reducer,
    ledger: Ledger.reducer,
    systemNotifications: SystemNotifications.reducer,
};

/**
 * This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
 * correctly typed to match your store.
 */
export interface AppThunkAction<TAction extends IAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

/**
 * Custom hook for using application Redux dispatch
 */
export const useAppDispatch = () => useDispatch<AppThunkAction<IAction>>();
