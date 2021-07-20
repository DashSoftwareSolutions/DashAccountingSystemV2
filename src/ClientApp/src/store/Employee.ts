import {
    Action,
    Dispatch,
    Reducer,
} from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import { Logger } from '../common/Logging';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import ActionType from './ActionType';
import EmployeeLite from '../models/EmployeeLite';
import IAction from './IAction';

export interface EmployeeStoreState {
    isLoading: boolean;
    employees: EmployeeLite[];
}

interface RequestEmployeesAction extends IAction {
    type: ActionType.REQUEST_EMPLOYEES;
}

interface ReceiveEmployeesAction extends IAction {
    type: ActionType.RECEIVE_EMPLOYEES;
    employees: EmployeeLite[];
}

type KnownAction = RequestEmployeesAction | ReceiveEmployeesAction;

const logger = new Logger('Employee Store');

export const actionCreators = {
    requestEmployees: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.employees) &&
            !appState.employees.isLoading &&
            (isEmpty(appState.employees.employees))) {

            const tenantId = appState.tenants?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Employees.');
                return;
            }

            const accessToken = await authService.getAccessToken();

            fetch(`api/workforce/${tenantId}/employees`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<EmployeeLite[]>
                })
                .then(employees => {
                    if (!isNil(employees)) {
                        dispatch({
                            type: ActionType.RECEIVE_EMPLOYEES,
                            employees,
                        });
                    }
                });

            dispatch({ type: ActionType.REQUEST_EMPLOYEES });
        }
    },
}

const unloadedState: EmployeeStoreState = {
    isLoading: false,
    employees: [],
};

export const reducer: Reducer<EmployeeStoreState> = (state: EmployeeStoreState | undefined, incomingAction: Action): EmployeeStoreState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_EMPLOYEES:
                return {
                    ...state,
                    isLoading: true
                };

            case ActionType.RECEIVE_EMPLOYEES:
                return {
                    ...state,
                    isLoading: false,
                    employees: action.employees,
                };
        }
    }

    return state;
};
