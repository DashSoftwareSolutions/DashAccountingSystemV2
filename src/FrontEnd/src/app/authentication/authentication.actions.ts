import ActionType from '../store/actionType';
import IAction from '../store/action.interface';
import AccessTokenResponse from './accessTokenResponse.model';

export interface RequestLoginAction extends IAction {
    type: ActionType.REQUEST_LOGIN;
}

export interface ReceiveFailedLoginResponseAction extends IAction {
    type: ActionType.RECEIVE_FAILED_LOGIN_RESPONSE;
}