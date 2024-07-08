import { isNil } from 'lodash';
import React, {
    useEffect,
    useMemo,
} from 'react';
import { DateTime } from 'luxon';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    Link,
    Outlet,
} from 'react-router-dom';
import {
    Col,
    Container,
    Row,
} from 'reactstrap';
import { actionCreators as authenticationActionCreators } from './authentication/data';
import { actionCreators as bootstrapActionCreators } from './bootstrap';
import NavMenu from './navMenu';
import { AccessTokenResponse } from './authentication/models';
import { ApplicationState } from './store';
import SystemNotificationsArea from './systemNotificationsArea';
import Loader from '../common/components/loader';
import { AUTH_SESSION_STORAGE_KEY } from '../common/constants';
import {
    ILogger,
    Logger,
} from '../common/logging';
import { decodeJsonObjectFromBase64 } from '../common/utilities/encoding';
import usePrevious from '../common/utilities/usePrevious';

const logger: ILogger = new Logger('Master Page');

const mapStateToProps = (state: ApplicationState) => ({
    isLoggedIn: state.authentication.isLoggedIn,
    bootstrapInfo: state.bootstrap,
});

const mapDispatchToProps = {
    requestApplicationVersion: bootstrapActionCreators.requestApplicationVersion,
    requestBootstrapInfo: bootstrapActionCreators.requestBootstrapInfo,
    setTokens: authenticationActionCreators.setTokens,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type LayoutRedexProps = ConnectedProps<typeof connector>;

type LayoutProps = LayoutRedexProps;

function Layout(props: LayoutProps) {
    const {
        isLoggedIn,
        bootstrapInfo,
        requestApplicationVersion,
        requestBootstrapInfo,
        setTokens,
    } = props;

    const wasLoggedIn = usePrevious(isLoggedIn);

    // Fetch the Application version (for the footer) when we initially load the application
    useEffect(() => {
        const authSessionData = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);

        if (!isNil(authSessionData)) {
            const decodedTokenData = decodeJsonObjectFromBase64<AccessTokenResponse>(authSessionData);

            if (!isNil(decodedTokenData) &&
                !isNil(decodedTokenData.expires)) {
                const tokenExpiry = DateTime.fromISO(decodedTokenData.expires);
                const now = DateTime.now();
                const isLoggedInBasedOnSessionData = tokenExpiry > now;

                if (isLoggedInBasedOnSessionData) {
                    setTokens(decodedTokenData);
                }
            }
        }

        requestApplicationVersion();
    }, []);

    useEffect(() => {
        if (!wasLoggedIn && isLoggedIn) {
            requestBootstrapInfo();
        }
    }, [isLoggedIn]);

    const today = useMemo(() => DateTime.now(), []);

    return (
        <React.Fragment>
            {bootstrapInfo.isFetchingVersion ? (
                <Loader />
            ) : (
                <React.Fragment>
                    <NavMenu userInfo={bootstrapInfo?.userInfo} />

                    <Container className="main-content-container">
                        <Outlet />
                    </Container>

                    <SystemNotificationsArea />

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
