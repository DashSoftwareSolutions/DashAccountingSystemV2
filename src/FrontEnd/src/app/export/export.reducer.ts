import { isNil } from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import { KnownAction } from './export.actions';
import { ExportDownloadInfo } from '../../common/models';
import ActionType from '../globalReduxStore/actionType';

export interface ExportState {
    downloadInfo: ExportDownloadInfo | null;
    error: string | null;
    isFetching: boolean;
}

const unloadedState: ExportState = {
    downloadInfo: null,
    error: null,
    isFetching: false,
};

const reducer: Reducer<ExportState> = (state: ExportState | undefined, incomingAction: Action): ExportState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.REQUEST_EXPORT_DOWNLOAD:
                return {
                    ...state,
                    isFetching: true,
                };

            case ActionType.RECEIVE_EXPORT_DOWNLOAD_ERROR:
                return {
                    ...state,
                    isFetching: false,
                    error: action.error,
                };

            case ActionType.RECEIVE_EXPORT_DOWNLOAD_INFO:
                return {
                    ...state,
                    isFetching: false,
                    downloadInfo: action.downloadInfo,
                    error: null,
                };

            case ActionType.RESET_EXPORT_STORE:
                return unloadedState;
        }
    }

    // All stores should get reset to default state on logout
    if (incomingAction.type === ActionType.RECEIVE_LOGOUT_RESPONSE) {
        return unloadedState;
    }

    return state;
};

export default reducer;
