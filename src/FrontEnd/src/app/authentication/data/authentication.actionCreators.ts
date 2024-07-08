import {
    isEmpty,
    isNil,
} from 'lodash';
import { Dispatch } from 'redux';
import { AppThunkAction } from '../../store';
import ActionType from '../../store/actionType';
import IAction from '../../store/action.interface';
import { KnownAction } from './authentication.actions';
import { AccessTokenResponse } from '../models';
import { apiErrorHandler } from '../../../common/utilities/errorHandling';

const actionCreators = {
    login: (email: string, password: string): AppThunkAction<KnownAction> => async (dispatch) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/authentication/login', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        dispatch({ type: ActionType.RECEIVE_FAILED_LOGIN_RESPONSE });
                    } else {
                        apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                    }

                    return null;
                }

                return response.json() as Promise<AccessTokenResponse>;
            })
            .then((accessTokenResponse) => {
                if (!isNil(accessTokenResponse)) {
                    dispatch({ type: ActionType.RECEIVE_SUCCESSFUL_LOGIN_RESPONSE, accessTokenResponse });
                }
            });

        dispatch({ type: ActionType.REQUEST_LOGIN });
    },

    logout: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const accessToken = appState.authentication.tokens?.accessToken;

        if (!isEmpty(accessToken)) {
            const requestOptions = {
                method: 'POST',
                body: '{}',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            fetch('/api/authentication/logout', requestOptions)
                .then(() => {
                    dispatch({ type: ActionType.RECEIVE_LOGOUT_RESPONSE });
                });

            dispatch({ type: ActionType.REQUEST_LOGOUT });
        } else {
            dispatch({ type: ActionType.RECEIVE_LOGOUT_RESPONSE });
        }
    },
};

export default actionCreators;
