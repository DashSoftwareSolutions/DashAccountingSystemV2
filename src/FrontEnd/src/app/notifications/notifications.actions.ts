import NotificationLevel from './notificationLevel';
import IAction from '../globalReduxStore/action.interface';
import ActionType from '../globalReduxStore/actionType';

/**
 * Action to show an alert in the System Notifications area
 */
export interface ShowAlertAction extends IAction {
    type: ActionType.SHOW_ALERT;

    /**
     * Controls the auto-dismiss behavior of the alert.<br />
     * * Specifying a number for this property intructs the alert to auto-dismiss after specified timeout.<br />
     * * Boolean `true` instructs the alert auto-dismiss after default timeout.<br />
     * * Boolean `false` means don't auto-dismiss the alert.
     */
    autoDismiss: number | boolean;

    /**
     * The Bootstrap theme color for the alert.
     */
    color: NotificationLevel;

    /**
     * Content of the alert.  Use a string for a simple message, or pass in JSX markup.
     */
    content: string | React.ReactNode;
}

/**
 * Action to manually dismiss an alert
 */
export interface DismissAlertAction extends IAction {
    type: ActionType.DISMISS_ALERT;

    /**
     * ID of the target alert.
     */
    alertId: string;
}

export type KnownAction = ShowAlertAction | DismissAlertAction;
