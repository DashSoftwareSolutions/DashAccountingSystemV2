import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { DateTime } from 'luxon';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { Outlet } from 'react-router-dom';
import {
    Col,
    Container,
    Row,
} from 'reactstrap';
import { actionCreators as bootstrapActionCreators } from './bootstrap';
import NavMenu from './navMenu';
import { ApplicationState } from './store';
import SystemNotificationsArea from './systemNotificationsArea';
import Loader from '../common/components/loader';
import {
    ILogger,
    Logger,
} from '../common/logging';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

const logger: ILogger = new Logger('Master Page');

const mapStateToProps = (state: ApplicationState) => ({
    bootstrapInfo: state.bootstrap,
});

const mapDispatchToProps = {
    requestApplicationVersion: bootstrapActionCreators.requestApplicationVersion,
    requestBootstrapInfo: bootstrapActionCreators.requestBootstrapInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type LayoutRedexProps = ConnectedProps<typeof connector>;

type LayoutProps = LayoutRedexProps;

function Layout(props: LayoutProps) {
    const {
        bootstrapInfo,
        requestApplicationVersion,
        requestBootstrapInfo,
    } = props;

    // Fetch the Application version (for the footer) when we initially load the application
    useEffect(() => {
        requestApplicationVersion();
    }, []);

    const today = useMemo(() => DateTime.now(), []);

    return (
        <React.Fragment>
            {bootstrapInfo.isFetchingVersion ? (
                <Loader />
            ): (
                <React.Fragment>
                    <NavMenu userInfo = {bootstrapInfo?.userInfo} />

                    <Container>
                        <SystemNotificationsArea />
                        <Outlet />
                    </Container>

                    <footer className="border-top footer text-muted">
                        <Container>
                            <Row>
                                <Col sm="6">
                                    &copy; 2022 - {today.year} - Dash Software Solutions, Inc. -
                                    {' '}
                                    <Link to="/privacy">Privacy</Link>
                                </Col>
                                <Col sm="6" className="text-right">
                                    {bootstrapInfo.applicationVersion}
                                </Col>
                            </Row>
                        </Container>
                    </footer>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export default connector(Layout);
