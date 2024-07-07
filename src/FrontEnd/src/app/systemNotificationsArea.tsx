import React, {
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { Alert } from 'reactstrap';
import {
    isNil,
    isNumber,
} from 'lodash';
import {
    ConnectedProps,
    connect
} from 'react-redux';
import { ApplicationState } from '../app/store';
import { DEFAULT_SYSTEM_NOTIFICATION_ALERT_TIMEOUT } from '../common/constants';
import { actionCreators as notificationActionCreators } from './notifications';

const mapStateToProps = (state: ApplicationState) => ({
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

    const prevAlertId = useRef<string | null>(alertId);

    useEffect(() => {
        if (!isNil(alertId) &&
            alertId !== prevAlertId.current &&
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

    const onDismissAlertClick = useCallback(() => {
        if (!isNil(alertId)) {
            dismissAlert(alertId);
        }
    }, [
        alertId,
        dismissAlert,
    ]);

    const alertMarkup = !isNil(alertColor) &&
        !isNil(alertContent) ? (
        <Alert
            color={alertColor}
            isOpen={alertIsVisible}
            toggle={onDismissAlertClick}
        >
            {alertContent}
        </Alert>
    ) : null;

    return (
        <div
            id="system_notifications_area"
            style={{
                height: 48,
                marginBottom: 22,
                marginTop: 11
            }}
        >
            {alertMarkup}
        </div>
    );
}

export default connector(SystemNotificationsArea);
