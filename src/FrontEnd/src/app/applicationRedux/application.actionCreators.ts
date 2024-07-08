import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { AppThunkAction } from '../globalReduxStore';
import ActionType from '../globalReduxStore/actionType';
import IAction from '../globalReduxStore/action.interface';
import {
    BootstrapInfo,
    NavigationSection,
    Tenant,
} from '../../common/models';
import { apiErrorHandler } from '../../common/utilities/errorHandling';
import { KnownAction } from './application.actions';

const actionCreators = {
    requestApplicationVersion: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.application) &&
            isEmpty(appState.application.applicationVersion) &&
            !appState.application.isFetchingVersion) {

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

        if (!isNil(appState?.application) &&
            !appState.application.isFetchingBootstrap &&
            isEmpty(appState.application.tenants) &&
            !isEmpty(appState.authentication.tokens?.accessToken)) {
            const accessToken = appState.authentication.tokens?.accessToken;

            fetch('/api/bootstrap', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
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

    setNavigationSection: (navigationSection: NavigationSection | null): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.SET_NAVIGATION_SECTION, navigationSection });
    },
};

export default actionCreators;
