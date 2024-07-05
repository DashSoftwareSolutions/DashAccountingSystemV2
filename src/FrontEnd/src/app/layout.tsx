import React, { useEffect } from 'react';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { Container } from 'reactstrap';
import NavMenu from './navMenu';
import {
    ILogger,
    Logger
} from '../common/logging';
import { ApplicationState } from './store';
import SystemNotificationsArea from './systemNotificationsArea';
import { actionCreators as bootstrapActionCreators } from './bootstrap';

const logger: ILogger = new Logger('Layout');

interface LayoutOwnProps {
    children?: React.ReactNode;
}

const mapStateToProps = (state: ApplicationState) => ({
    bootstrapInfo: state.bootstrap,
});

const mapDispatchToProps = {
    requestBootstrapInfo: bootstrapActionCreators.requestBootstrapInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type LayoutRedexProps = ConnectedProps<typeof connector>;

type LayoutProps = LayoutOwnProps & LayoutRedexProps;

function Layout(props: LayoutProps) {
    const {
        bootstrapInfo,
        children,
        requestBootstrapInfo,
    } = props;

    useEffect(() => {
        logger.info('Layout - useEffect w/ empty dependencies...');
        requestBootstrapInfo();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            {bootstrapInfo.isFetching ? (
                <div id="app_loading_spinner" className="align-items-center justify-content-center" style={{ display: 'flex', height: 'calc(100vh - 250px)' }} >
                    <div className="spinner-border" role="status" style={{ width: '5rem', height: '5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ): (
                <React.Fragment>
                    <NavMenu userInfo = {bootstrapInfo?.userInfo} />
                    <Container>
                        <SystemNotificationsArea />
                        {children}
                    </Container>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export default connector(Layout);
