import ActionType from '../store/actionType';
import IAction from '../store/iaction.interface';
import {
    BootstrapInfo,
    Tenant,
} from '../../common/models';

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

export type KnownAction = RequestBootstrapInfoAction | ReceiveBootstrapInfoAction | SelectTenantAction;
