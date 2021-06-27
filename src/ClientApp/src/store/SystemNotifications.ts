import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {
    isNil,
    uniqueId,
} from 'lodash';
import { Logger } from '../common/Logging';

export interface SystemNotificationsState {
    alertAutoDismiss: number | boolean; // number means auto-dismiss after specified timeout / boolean true means atuo-dismiss after default timeout; boolean false means don't auto-dismiss
    alertColor: string | null;
    alertContent: any | null; // should be a simple string or JSX
    alertId: string | null;
    alertIsVisible: boolean;
}

interface ShowAlertAction {
    type: 'SHOW_ALERT';
    autoDismiss: number | boolean; // number means auto-dismiss after specified timeout / boolean true means atuo-dismiss after default timeout; boolean false means don't auto-dismiss
    color: string;
    content: any; // should be a simple string or JSX
}

interface DismissAlertAction {
    type: 'DISMISS_ALERT';
    alertId: string;
}

type KnownAction = ShowAlertAction | DismissAlertAction;

const logger = new Logger('System Notifications Store');

export const actionCreators = {
    showAlert: (color: string, content: any, autoDismiss: number | boolean): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: 'SHOW_ALERT',
            autoDismiss,
            color,
            content,
        });
    },

    dismissAlert: (alertId: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'DISMISS_ALERT', alertId });
    },
};

const unloadedState: SystemNotificationsState = {
    alertAutoDismiss: false,
    alertColor: null,
    alertContent: null,
    alertId: null,
    alertIsVisible: false,
};

export const reducer: Reducer<SystemNotificationsState> = (state: SystemNotificationsState | undefined, incomingAction: Action): SystemNotificationsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case 'SHOW_ALERT':
                return {
                    alertAutoDismiss: action.autoDismiss,
                    alertColor: action.color,
                    alertContent: action.content,
                    alertId: uniqueId(),
                    alertIsVisible: true,
                };

            case 'DISMISS_ALERT': {
                logger.debug('Dismissing alert ID:', action.alertId);
                logger.debug('Current state alert ID:', state.alertId);
                if (action.alertId === state.alertId) {
                    return {
                        ...state,
                        alertIsVisible: false,
                    };
                }
            }
        }
    }

    return state;
};
