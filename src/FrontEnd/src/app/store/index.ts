import { useDispatch } from 'react-redux';
import IAction from './iaction.interface';
import * as Bootstrap from '../bootstrap'
import * as SystemNotifications from '../notifications';

/**
 * Redux state tree for the entire application
 */
export interface ApplicationState {
    bootstrap: Bootstrap.state,
    systemNotifications: SystemNotifications.state;
}

/**
 * All Redux Reducers
 */
export const reducers = {
    bootstrap: Bootstrap.reducer,
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
