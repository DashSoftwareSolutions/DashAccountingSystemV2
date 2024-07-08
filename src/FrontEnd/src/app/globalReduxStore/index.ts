import { useDispatch } from 'react-redux';
import IAction from './action.interface';
import * as Application from '../applicationRedux'
import * as Authentication from '../authentication/redux';
import * as ChartOfAccounts from '../../features/accounting/chart-of-accounts/redux';
import * as Journal from '../../features/accounting/journal/redux';
import * as Ledger from '../../features/accounting/general-ledger/redux';
import * as SystemNotifications from '../notifications';

/**
 * Redux state tree for the entire application
 */
export interface RootState {
    application: Application.state,
    authentication: Authentication.state,
    chartOfAccounts: ChartOfAccounts.state,
    journal: Journal.state,
    ledger: Ledger.state,
    systemNotifications: SystemNotifications.state;
}

/**
 * All Redux Reducers
 */
export const reducers = {
    chartOfAccounts: ChartOfAccounts.reducer,
    application: Application.reducer,
    authentication: Authentication.reducer,
    journal: Journal.reducer,
    ledger: Ledger.reducer,
    systemNotifications: SystemNotifications.reducer,
};

/**
 * This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
 * correctly typed to match your store.
 */
export interface AppThunkAction<TAction extends IAction> {
    (dispatch: (action: TAction) => void, getState: () => RootState): void;
}
