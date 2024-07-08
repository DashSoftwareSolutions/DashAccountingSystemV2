import ActionType from '../../store/actionType';
import IAction from '../../store/action.interface';
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

export interface SetExistingTokensAction extends IAction {
    type: ActionType.SET_EXISTING_TOKENS_FROM_SESSION_STORAGE;
    tokens: AccessTokenResponse;
}

export type KnownAction = RequestLoginAction |
    ReceiveFailedLoginResponseAction |
    ReceiveSuccessfulLoginResponseAction |
    RequestLogoutAction |
    ReceiveLogoutResponseAction |
    SetExistingTokensAction;
