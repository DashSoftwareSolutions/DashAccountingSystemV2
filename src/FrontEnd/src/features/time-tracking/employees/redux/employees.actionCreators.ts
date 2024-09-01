import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { KnownAction } from './employees.actions';
import { AppThunkAction } from '../../../../app/globalReduxStore';
import IAction from '../../../../app/globalReduxStore/action.interface';
import ActionType from '../../../../app/globalReduxStore/actionType';
import {
    ILogger,
    Logger,
} from '../../../../common/logging';
import { apiErrorHandler } from '../../../../common/utilities/errorHandling';
import { EmployeeLite } from '../models';

const logger: ILogger = new Logger('Employee Actions');

const actionCreators = {
    requestEmployees: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.employees) &&
            !appState.employees.isFetching &&
            (isEmpty(appState.employees.employees))) {

            const tenantId = appState.application?.selectedTenant?.id;

            if (isNil(tenantId)) {
                logger.warn('No selected Tenant.  Cannot fetch Employees.');
                return;
            }

            const accessToken = appState.authentication.tokens?.accessToken;

            fetch(`/api/workforce/${tenantId}/employees`, {
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
};

export default actionCreators;
