import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { EmployeeLite } from '../models';

export interface RequestEmployeesAction extends IAction {
    type: ActionType.REQUEST_EMPLOYEES;
}

export interface ReceiveEmployeesAction extends IAction {
    type: ActionType.RECEIVE_EMPLOYEES;
    employees: EmployeeLite[];
}

export type KnownAction = RequestEmployeesAction | ReceiveEmployeesAction;
