import ActionType from '../../globalReduxStore/actionType';
import IAction from '../../globalReduxStore/action.interface';
import { AccessTokenResponse } from '../models';

export interface RequestLoginAction extends IAction {
    type: ActionType.REQUEST_LOGIN;
}

export interface ReceiveFailedLoginResponseAction extends IAction {
    type: ActionType.RECEIVE_FAILED_LOGIN_RESPONSE;
}

export interface ReceiveSuccessfulLoginResponseAction extends IAction {
    type: ActionType.RECEIVE_SUCCESSFUL_LOGIN_RESPONSE;
    accessTokenResponse: AccessTokenResponse;
}

export interface RequestLogoutAction extends IAction {
    type: ActionType.REQUEST_LOGOUT;
}

export interface ReceiveLogoutResponseAction extends IAction {
    type: ActionType.RECEIVE_LOGOUT_RESPONSE;
}

export interface RequestTokenRefreshAction extends IAction {
    type: ActionType.REQUEST_TOKEN_REFRESH;
}

export interface ReceiveUpdatedTokensAction extends IAction {
    type: ActionType.RECEIVE_UPDATED_TOKENS;
    accessTokenResponse: AccessTokenResponse;
}

export interface TokenRefreshFailedAction extends IAction {
    type: ActionType.TOKEN_REFRESH_FAILED;
}

export interface SetExistingTokensAction extends IAction {
    type: ActionType.SET_EXISTING_TOKENS_FROM_SESSION_STORAGE;
    tokens: AccessTokenResponse;
}

export type KnownAction = RequestLoginAction |
    ReceiveFailedLoginResponseAction |
    ReceiveSuccessfulLoginResponseAction |
    RequestLogoutAction |
    ReceiveLogoutResponseAction |
    RequestTokenRefreshAction |
    ReceiveUpdatedTokensAction |
    TokenRefreshFailedAction |
    SetExistingTokensAction;
