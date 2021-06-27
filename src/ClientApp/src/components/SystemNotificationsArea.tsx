import * as React from 'react';
import { Alert } from 'reactstrap';
import { ConnectedProps, connect } from 'react-redux';
import { isNil } from 'lodash';
import { ApplicationState } from '../store';
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
        const { alertId: nextAlertId } = this.props;

        console.log('[System Notifications Area] componentDidUpdate ... prevAlertId:', prevAlertId);
        console.log('[System Notifications Area] componentDidUpdate ... nextAlertId:', nextAlertId);

        // TODO/FIXME: Not working for some reason :-(
        /*if (nextAlertId !== prevAlertId &&
            !isNil(nextAlertId)) {
            this.setState({ currentAlertId: nextAlertId });
            // TODO: Handle auto-dismiss
        }*/
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
            <div style={{ height: 48, marginBottom: 22, marginTop: 22 }}>
                {alertMarkup}
            </div>
        );
    }

    private onDismissAlertClick() {
        // TODO/FIXME: Not working for some reason
        /*const { dismissAlert } = this.props;
        const { currentAlertId } = this.state;
        console.log('[System Notifications Area] onDismissAlertClick ... currentAlertId:', currentAlertId);

        if (!isNil(currentAlertId)) {
            dismissAlert(currentAlertId);
        }*/

        const { alertId, dismissAlert } = this.props;
        if (!isNil(alertId)) {
            dismissAlert(alertId);
            this.setState({ currentAlertId: null });
        }
    }
}

export default connector(SystemNotificationsArea);
