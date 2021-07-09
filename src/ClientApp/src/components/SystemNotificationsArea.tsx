import * as React from 'react';
import { Alert } from 'reactstrap';
import { ConnectedProps, connect } from 'react-redux';
import {
    isNil,
    isNumber,
} from 'lodash';
import { ApplicationState } from '../store';
import { DEFAULT_SYSTEM_NOTIFICATION_ALERT_TIMEOUT } from '../common/Constants';
import * as SystemNotificationsStore from '../store/SystemNotifications';

const mapStateToProps = (state: ApplicationState) => ({
    alertAutoDismiss: state.systemNotifications?.alertAutoDismiss ?? false,
    alertColor: state.systemNotifications?.alertColor ?? null,
    alertContent: state.systemNotifications?.alertContent ?? null,
    alertId: state.systemNotifications?.alertId ?? null,
    alertIsVisible: state.systemNotifications?.alertIsVisible ?? false,
});

const mapDispatchToProps = {
    ...SystemNotificationsStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type SystemNotificationsAreaProps = ConnectedProps<typeof connector>;

interface SystemNotificationsAreaState {
    currentAlertId: string | null;
}

class SystemNotificationsArea extends React.PureComponent<SystemNotificationsAreaProps, SystemNotificationsAreaState> {
    public constructor(props: SystemNotificationsAreaProps) {
        super(props);

        this.state = { currentAlertId: null };

        this.onDismissAlertClick = this.onDismissAlertClick.bind(this);
    }

    public componentDidUpdate(prevProps: SystemNotificationsAreaProps) {
        const { alertId: prevAlertId } = prevProps;

        const {
            alertAutoDismiss,
            alertId: nextAlertId,
            dismissAlert,
        } = this.props;

        if (nextAlertId !== prevAlertId &&
            !isNil(nextAlertId)) {
            this.setState({ currentAlertId: nextAlertId });

            if (!isNil(alertAutoDismiss) && !!alertAutoDismiss) {
                const autoDismissTimeout = isNumber(alertAutoDismiss) ?
                    alertAutoDismiss :
                    DEFAULT_SYSTEM_NOTIFICATION_ALERT_TIMEOUT;

                setTimeout(() => {
                    dismissAlert(nextAlertId);
                }, autoDismissTimeout);
            }
        }
    }

    public render() {
        const {
            alertColor,
            alertContent,
            alertIsVisible,
        } = this.props;

        const alertMarkup = !isNil(alertColor) &&
            !isNil(alertContent) ? (
                <Alert
                    color={alertColor}
                    isOpen={alertIsVisible}
                    toggle={this.onDismissAlertClick}
                >
                    {alertContent}
                </Alert>
            ): null;

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

    private onDismissAlertClick() {
        const { dismissAlert } = this.props;
        const { currentAlertId } = this.state;

        if (!isNil(currentAlertId)) {
            dismissAlert(currentAlertId);
        }
    }
}

export default connector(SystemNotificationsArea);
