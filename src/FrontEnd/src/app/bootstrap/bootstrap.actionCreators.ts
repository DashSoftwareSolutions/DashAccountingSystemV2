import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { AppThunkAction } from '../store';
import ActionType from '../store/actionType';
import IAction from '../store/action.interface';
import {
    BootstrapInfo,
    Tenant,
} from '../../common/models';
import { apiErrorHandler } from '../../common/utilities/errorHandling';
import { KnownAction } from './bootstrap.actions';

const actionCreators = {
    requestApplicationVersion: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.bootstrap) &&
            isEmpty(appState.bootstrap.applicationVersion) &&
            !appState.bootstrap.isFetchingVersion) {

            fetch('/api/application-version')
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    response
                        .json()
                        .then((appVersionInfo) => {
                            dispatch({ type: ActionType.RECEIVE_APPLICATION_VERSION, applicationVersion: appVersionInfo.version });
                        });
                });

            dispatch({ type: ActionType.REQUEST_APPLICATION_VERSION });
        }
    },

    requestBootstrapInfo: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.bootstrap) &&
            !appState.bootstrap.isFetching &&
            isEmpty(appState.bootstrap.tenants)) {

            fetch('/api/bootstrap')
                .then((response) => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        return null;
                    }

                    return response.json() as Promise<BootstrapInfo>;
                })
                .then((bootstrapInfo) => {
                    if (!isNil(bootstrapInfo)) {
                        dispatch({ type: ActionType.RECEIVE_BOOTSTRAP_INFO, bootstrapInfo });

                        if (!isEmpty(bootstrapInfo.tenants) &&
                            bootstrapInfo.tenants.length === 1) {
                            dispatch({ type: ActionType.SELECT_TENANT, tenant: bootstrapInfo.tenants[0] });
                        }
                    }
                });
        }

        dispatch({ type: ActionType.REQUEST_BOOTSTRAP_INFO });
    },

    selectTenant: (tenant: Tenant): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.SELECT_TENANT, tenant });
    },
};

export default actionCreators;
