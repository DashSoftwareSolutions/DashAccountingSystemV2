import ActionType from '../../../../app/globalReduxStore/actionType';
import IAction from '../../../../app/globalReduxStore/action.interface';
import { Account } from '../models';

interface RequestAccountsAction extends IAction {
    type: ActionType.REQUEST_ACCOUNTS;
}

interface ReceiveAccountsAction extends IAction {
    type: ActionType.RECEIVE_ACCOUNTS;
    accounts: Account[];
}

interface SelectAccountAction extends IAction {
    type: ActionType.SELECT_ACCOUNT;
    account: Account;
}

export type KnownAction = RequestAccountsAction | ReceiveAccountsAction | SelectAccountAction;
