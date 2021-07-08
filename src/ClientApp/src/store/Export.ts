import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {
    isNil,
} from 'lodash';
import { Logger } from '../common/Logging';
import ActionType from './ActionType';
import ExportDownloadInfo from '../models/ExportDownloadInfo';
import IAction from './IAction';

export interface ExportState {
    downloadInfo: ExportDownloadInfo | null;
    error: string | null;
    isLoading: boolean;
}

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

interface ResetExportStoreAction extends IAction {
    type: ActionType.RESET_EXPORT_STORE;
}

type KnownAction = RequestDownloadAction |
    ReceiveDownloadErrorAction |
    ReceiveDownloadInfoAction | 
    ResetExportStoreAction;

// Always have a logger in case we need to use it for debuggin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = new Logger('Export Store');

export const actionCreators = {
    reset: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: ActionType.RESET_EXPORT_STORE });
    },
};

const unloadedState: ExportState = {
    isLoading: false,
    downloadInfo: null,
    error: null,
};

export const reducer: Reducer<ExportState> = (state: ExportState | undefined, incomingAction: Action): ExportState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_EXPORT_DOWNLOAD:
                return {
                    ...state,
                    isLoading: true,
                };

            case ActionType.RECEIVE_EXPORT_DOWNLOAD_ERROR:
                return {
                    ...state,
                    isLoading: false,
                    error: action.error,
                };

            case ActionType.RECEIVE_EXPORT_DOWNLOAD_INFO:
                return {
                    ...state,
                    isLoading: false,
                    downloadInfo: action.downloadInfo,
                    error: null,
                };

            case ActionType.RESET_EXPORT_STORE:
                return unloadedState;
        }
    }

    return state;
};