import {
    isEmpty,
    isNil,
} from 'lodash';
import { DateTime } from 'luxon';
import { Dispatch } from 'redux';
import { AppThunkAction } from '../../globalReduxStore';
import ActionType from '../../globalReduxStore/actionType';
import IAction from '../../globalReduxStore/action.interface';
import { KnownAction } from './authentication.actions';
import { AccessTokenResponse } from '../models';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import { apiErrorHandler } from '../../../common/utilities/errorHandling';

const logger: ILogger = new Logger('Authentication Actions');

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
                    const expires = DateTime.now().plus({ seconds: accessTokenResponse.expiresIn });
                    logger.info('Login Tokens received.  Current access token will expire at', expires.toISO());
                    accessTokenResponse.expires = expires.toISO();

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

    refreshTokens: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const refreshToken = appState.authentication.tokens?.refreshToken;

        if (!isEmpty(refreshToken)) {
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            fetch('/api/authentication/refresh-token', requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            dispatch({ type: ActionType.TOKEN_REFRESH_FAILED });
                        } else {
                            apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                        }

                        return null;
                    }

                    return response.json() as Promise<AccessTokenResponse>;
                })
                .then((accessTokenResponse) => {
                    if (!isNil(accessTokenResponse)) {
                        const expires = DateTime.now().plus({ seconds: accessTokenResponse.expiresIn });
                        logger.info('Updated Tokens from successful refresh operation received.  Current access token will expire at', expires.toISO());
                        accessTokenResponse.expires = expires.toISO();

                        dispatch({ type: ActionType.RECEIVE_UPDATED_TOKENS, accessTokenResponse });
                    }
                });

            dispatch({ type: ActionType.REQUEST_TOKEN_REFRESH });
        }
    },

    setTokens: (tokens: AccessTokenResponse): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.SET_EXISTING_TOKENS_FROM_SESSION_STORAGE, tokens });
    },
};

export default actionCreators;
