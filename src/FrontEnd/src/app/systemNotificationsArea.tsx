import React, {
    useCallback,
    useEffect,
} from 'react';
import {
    isNil,
    isNumber,
} from 'lodash';
import {
    ConnectedProps,
    connect
} from 'react-redux';
import {
    Toast,
    ToastBody,
    ToastHeader,
} from 'reactstrap'; // TODO/FIXME: current version of Reactstrap gives us this warning for <Toast> component (which internally uses <Fade> component): Warning: Fade: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.
import { actionCreators as notificationActionCreators } from './notifications';
import NotificationLevel from './notifications/notificationLevel';
import { RootState } from '../app/globalReduxStore';
import { DEFAULT_SYSTEM_NOTIFICATION_ALERT_TIMEOUT } from '../common/constants';
import usePrevious from '../common/utilities/usePrevious';

const mapStateToProps = (state: RootState) => ({
    alertAutoDismiss: state.systemNotifications?.alertAutoDismiss ?? false,
    alertColor: state.systemNotifications?.alertColor ?? null,
    alertContent: state.systemNotifications?.alertContent ?? null,
    alertId: state.systemNotifications?.alertId ?? null,
    alertIsVisible: state.systemNotifications?.alertIsVisible ?? false,
});

const mapDispatchToProps = {
    ...notificationActionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type SystemNotificationsAreaProps = ConnectedProps<typeof connector>;

function SystemNotificationsArea(props: SystemNotificationsAreaProps) {
    const {
        alertAutoDismiss,
        alertColor,
        alertContent,
        alertId,
        alertIsVisible,
        dismissAlert,
    } = props;

    const prevAlertId = usePrevious<string | null>(alertId);

    useEffect(() => {
        if (!isNil(alertId) &&
            alertId !== prevAlertId &&
            !isNil(alertAutoDismiss) &&
            !!alertAutoDismiss) {
            const autoDismissTimeout = isNumber(alertAutoDismiss) ?
                alertAutoDismiss :
                DEFAULT_SYSTEM_NOTIFICATION_ALERT_TIMEOUT;

            setTimeout(() => { dismissAlert(alertId); }, autoDismissTimeout);
        }
    }, [
        alertId,
        alertAutoDismiss,
        dismissAlert,
        prevAlertId,
    ]);

    const onDismissToastClick = useCallback(() => {
        if (!isNil(alertId)) {
            dismissAlert(alertId);
        }
    }, [
        alertId,
        dismissAlert,
    ]);

    let title: string = '';

    switch (alertColor) {
        case NotificationLevel.Danger:
        case NotificationLevel.Warning:
            title = 'Error';
            break;
        case NotificationLevel.Info:
            title = 'Info';
            break;
        case NotificationLevel.Success:
            title = 'Success';
            break;
        default:
    }

    return (
        <div aria-live="polite" aria-atomic="true" className="position-relative">
            <div className="toast-container position-absolute bottom-0 end-0 p-3">
                <Toast isOpen={alertIsVisible}>
                    <ToastHeader
                        icon={alertColor}
                        toggle={onDismissToastClick}
                    >
                        {title}
                    </ToastHeader>
                    <ToastBody>
                        {alertContent}
                    </ToastBody>
                </Toast>
            </div>
        </div>
    );
}

export default connector(SystemNotificationsArea);
