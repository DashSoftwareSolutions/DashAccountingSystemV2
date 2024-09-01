import {
    BootstrapInfo,
    NavigationSection,
    Tenant,
} from '../../common/models';
import IAction from '../globalReduxStore/action.interface';
import ActionType from '../globalReduxStore/actionType';

export interface RequestApplicationVersionAction extends IAction {
    type: ActionType.REQUEST_APPLICATION_VERSION;
}

export interface ReceiveApplicationVersionAction extends IAction {
    type: ActionType.RECEIVE_APPLICATION_VERSION;
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

export interface SetMainContentContainerHeightAction extends IAction {
    type: ActionType.SET_MAIN_CONTENT_CONTAINER_HEIGHT;
    height: number;
}

export interface SetNavigationSectionAction extends IAction {
    type: ActionType.SET_NAVIGATION_SECTION;
    navigationSection: NavigationSection | null;
}

export type KnownAction =
    RequestApplicationVersionAction |
    ReceiveApplicationVersionAction |
    RequestBootstrapInfoAction |
    ReceiveBootstrapInfoAction |
    SelectTenantAction |
    SetMainContentContainerHeightAction |
    SetNavigationSectionAction;
