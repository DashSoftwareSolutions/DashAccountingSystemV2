import {
    isNil,
    uniqueId,
} from 'lodash';
import {
    Action,
    Reducer,
} from 'redux';
import NotificationLevel from './notificationLevel';
import { KnownAction } from './notifications.actions';
import ActionType from '../globalReduxStore/actionType';

/**
 * State for the System Notifications Redux "slice"
 */
export interface SystemNotificationsState {
    /**
     * Controls the auto-dismiss behavior of the alert.<br />
     * * Specifying a number for this property intructs the alert to auto-dismiss after specified timeout.<br />
     * * Boolean `true` instructs the alert auto-dismiss after default timeout.<br />
     * * Boolean `false` means don't auto-dismiss the alert.
     */
    alertAutoDismiss: number | boolean;

    /**
     * The Bootstrap theme color for the alert.
     */
    alertColor: NotificationLevel | null;

    /**
     * The content of the alert.
     */
    alertContent: string | React.ReactNode | null;

    /**
     * The ID of the current alert.
     */
    alertId: string | null;

    /**
     * Boolean flag indicating whether or not the alert is visible.
     */
    alertIsVisible: boolean;
}

const unloadedState: SystemNotificationsState = {
    alertAutoDismiss: false,
    alertColor: null,
    alertContent: null,
    alertId: null,
    alertIsVisible: false,
};

const reducer: Reducer<SystemNotificationsState> = (state: SystemNotificationsState | undefined, incomingAction: Action): SystemNotificationsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case ActionType.SHOW_ALERT:
                return {
                    alertAutoDismiss: action.autoDismiss,
                    alertColor: action.color,
                    alertContent: action.content,
                    alertId: uniqueId(),
                    alertIsVisible: true,
                };

            case ActionType.DISMISS_ALERT: {
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

export default reducer;
