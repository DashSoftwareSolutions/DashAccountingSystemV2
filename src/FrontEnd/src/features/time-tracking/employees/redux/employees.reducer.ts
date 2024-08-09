import { isNil } from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './employees.actions';
import ActionType from '../../../../app/globalReduxStore/actionType';
import { EmployeeLite } from '../models';

export interface EmployeeStoreState {
    isFetching: boolean;
    employees: EmployeeLite[];
}

const unloadedState: EmployeeStoreState = {
    isFetching: false,
    employees: [],
};

const reducer: Reducer<EmployeeStoreState> = (state: EmployeeStoreState | undefined, incomingAction: Action): EmployeeStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_EMPLOYEES:
                return {
                    ...state,
                    isFetching: true
                };

            case ActionType.RECEIVE_EMPLOYEES:
                return {
                    ...state,
                    isFetching: false,
                    employees: action.employees,
                };
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
