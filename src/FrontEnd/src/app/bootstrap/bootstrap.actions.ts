import ActionType from '../store/actionType';
import IAction from '../store/action.interface';
import {
    BootstrapInfo,
    Tenant,
} from '../../common/models';

export interface RequestApplicationVersionAction extends IAction {
    type: ActionType.REQUEST_APPLICATION_VERSION,
}

export interface ReceiveApplicationVersionAction extends IAction {
    type: ActionType.RECEIVE_APPLICATION_VERSION,
    applicationVersion: string;
}

export interface RequestBootstrapInfoAction extends IAction {
    type: ActionType.REQUEST_BOOTSTRAP_INFO;
}

export interface ReceiveBootstrapInfoAction extends IAction {
    type: ActionType.RECEIVE_BOOTSTRAP_INFO;
    bootstrapInfo: BootstrapInfo;
}

export interface SelectTenantAction extends IAction {
    type: ActionType.SELECT_TENANT;
    tenant: Tenant;
}

export type KnownAction =
    RequestApplicationVersionAction |
    ReceiveApplicationVersionAction |
    RequestBootstrapInfoAction |
    ReceiveBootstrapInfoAction |
    SelectTenantAction;
