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

interface LayoutOwnProps {
    children?: React.ReactNode;
}

const mapStateToProps = (state: ApplicationState) => ({
    bootstrapInfo: state.bootstrap,
});

const mapDispatchToProps = {
    requestApplicationVersion: bootstrapActionCreators.requestApplicationVersion,
    requestBootstrapInfo: bootstrapActionCreators.requestBootstrapInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type LayoutRedexProps = ConnectedProps<typeof connector>;

type LayoutProps = LayoutOwnProps & LayoutRedexProps;

function Layout(props: LayoutProps) {
    const {
        bootstrapInfo,
        children,
        requestApplicationVersion,
        requestBootstrapInfo,
    } = props;

    //useEffect(() => {
    //    requestBootstrapInfo();
    //    // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
    //    // eslint-disable-next-line react-hooks/exhaustive-deps
    //}, []);

    const appVersionRef = useRef<string>(bootstrapInfo.applicationVersion);
    const [isFetching, setIsFetching] = useState<boolean>(isEmpty(bootstrapInfo.applicationVersion));
    const [isFetchingAppVersion, setIsFetchingAppVersion] = useState<boolean>(false);
    logger.info('Is Feching:', isFetching);

    // Fetch the Application version (for the footer) when we initially load the application
    useEffect(() => {
        if (!isFetchingAppVersion && isEmpty(bootstrapInfo.applicationVersion)) {
            logger.info('Fetching application version...');
            setIsFetchingAppVersion(true);

            setTimeout(() => {
                requestApplicationVersion();
            }, 3000); // NOTE: Timeout is so we don't try to call back-end before it's ready.
        }
    }, [
        bootstrapInfo.applicationVersion,
        isFetchingAppVersion,
    ]);

    useEffect(() => {
        logger.info('\'did update\' useEffect() for application version');
        logger.info('appVersionRef.current:', appVersionRef.current);
        logger.info('bootstrapInfo.applicationVersion:', bootstrapInfo.applicationVersion);
        if (isEmpty(appVersionRef.current) && !isEmpty(bootstrapInfo.applicationVersion)) {
            setIsFetching(false);
        }
    }, [
        bootstrapInfo.applicationVersion,
    ]);

    const today = useMemo(() => DateTime.now(), []);

    return (
        <React.Fragment>
            {isFetching ? (
                <Loader />
            ): (
                <React.Fragment>
                    <NavMenu userInfo = {bootstrapInfo?.userInfo} />

                    <Container>
                        <SystemNotificationsArea />
                        {children}
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
