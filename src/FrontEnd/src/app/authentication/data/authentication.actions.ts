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

export type KnownAction = RequestLoginAction |
    ReceiveFailedLoginResponseAction |
    ReceiveSuccessfulLoginResponseAction;
