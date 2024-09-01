import { ExportDownloadInfo } from '../../common/models';
import IAction from '../globalReduxStore/action.interface';
import ActionType from "../globalReduxStore/actionType";

// this is a common action type that other stores may dispatch to expose export/download functionality for their feature area
export interface RequestDownloadAction extends IAction {
    type: ActionType.REQUEST_EXPORT_DOWNLOAD;
}

// this is a common action type that other stores may dispatch to expose export/download functionality for their feature area
export interface ReceiveDownloadErrorAction extends IAction {
    type: ActionType.RECEIVE_EXPORT_DOWNLOAD_ERROR;
    error: string;
}

// this is a common action type that other stores may dispatch to expose export/download functionality for their feature area
export interface ReceiveDownloadInfoAction extends IAction {
    type: ActionType.RECEIVE_EXPORT_DOWNLOAD_INFO;
    downloadInfo: ExportDownloadInfo;
}

export interface ResetExportStoreAction extends IAction {
    type: ActionType.RESET_EXPORT_STORE;
}

export type KnownAction = RequestDownloadAction |
    ReceiveDownloadErrorAction |
    ReceiveDownloadInfoAction |
    ResetExportStoreAction;
