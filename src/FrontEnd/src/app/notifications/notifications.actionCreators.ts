import ActionType from '../globalReduxStore/actionType';
import { AppThunkAction } from '../globalReduxStore';
import {
    DismissAlertAction,
    ShowAlertAction
} from './notifications.actions';
import NotificationLevel from './notificationLevel';

const actionCreators = {
    showAlert: (
        color: NotificationLevel,
        content: string | React.ReactNode,
        autoDismiss: number | boolean,
    ): AppThunkAction<ShowAlertAction> => (dispatch) => {
        dispatch({
            type: ActionType.SHOW_ALERT,
            autoDismiss,
            color,
            content,
        });
    },

    dismissAlert: (alertId: string): AppThunkAction<DismissAlertAction> => (dispatch) => {
        dispatch({ type: ActionType.DISMISS_ALERT, alertId });
    },
};

export default actionCreators;
