import { isNil } from 'lodash';
import React, {
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { DateTime, Duration } from 'luxon';
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
import { actionCreators as authenticationActionCreators } from './authentication/redux';
import { actionCreators as bootstrapActionCreators } from './applicationRedux';
import NavMenu from './navMenu';
import { AccessTokenResponse } from './authentication/models';
import { RootState } from './globalReduxStore';
import SystemNotificationsArea from './systemNotificationsArea';
import Loader from '../common/components/loader';
import { AUTH_SESSION_STORAGE_KEY } from '../common/constants';
import {
    ILogger,
    Logger,
} from '../common/logging';
import { decodeJsonObjectFromBase64 } from '../common/utilities/encoding';
import usePrevious from '../common/utilities/usePrevious';

/**
 * How frequently we poll the remaining lifetime of the current access token.
 * Also used to determine if we attempt to refresh the token (i.e. if we're
 * within this amount of time of the upcoming expiry).
 */
const TOKEN_LIFETIME_MONITOR_INTERVAL_MS = 300000;  // 300,000 ms => 5 minutes

const logger: ILogger = new Logger('Master Page');

const mapStateToProps = (state: RootState) => ({
    application: state.application,
    isLoggedIn: state.authentication.isLoggedIn,
    tokenExpires: state.authentication.tokens?.expires,
});

const mapDispatchToProps = {
    refreshTokens: authenticationActionCreators.refreshTokens,
    requestApplicationVersion: bootstrapActionCreators.requestApplicationVersion,
    requestBootstrapInfo: bootstrapActionCreators.requestBootstrapInfo,
    setTokens: authenticationActionCreators.setTokens,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type LayoutRedexProps = ConnectedProps<typeof connector>;

type LayoutProps = LayoutRedexProps;

function Layout(props: LayoutProps) {
    const {
        application,
        isLoggedIn,
        refreshTokens,
        requestApplicationVersion,
        requestBootstrapInfo,
        setTokens,
        tokenExpires,
    } = props;

    const today = useMemo(() => DateTime.now(), []);
    const wasLoggedIn = usePrevious(isLoggedIn);
    const checkForExpiringTokenIntervalRef = useRef<NodeJS.Timer>();

    // One-time ("component did mount") operations (NOTE: Runs twice in development mode; see https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)
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

    // Setup an interval to monitor access token lifetime
    useEffect(() => {
        if (!isNil(tokenExpires)) {
            const tokenExpirationPollingFrequency = Duration.fromMillis(TOKEN_LIFETIME_MONITOR_INTERVAL_MS);
            logger.info(`Initializing interval to monitor access token lifetime (polling interval ${tokenExpirationPollingFrequency.rescale().toHuman({ unitDisplay: 'short' })}) ...`);

            const intervalId = setInterval(() => {
                const now = DateTime.now();
                const tokenExpirationDate = DateTime.fromISO(tokenExpires);

                if (tokenExpirationDate > now) {
                    const remainingTime = tokenExpirationDate.diff(now);
                    logger.info(`Token expiration will happen in ${remainingTime.rescale().toHuman({ unitDisplay: 'short' })}`);

                    if (remainingTime <= tokenExpirationPollingFrequency) {
                        logger.info('Attempting token refresh ...');
                        refreshTokens();
                    }
                } else {
                    logger.warn('Token is already expired!  It expired at:', tokenExpires);
                }
            }, TOKEN_LIFETIME_MONITOR_INTERVAL_MS);

            checkForExpiringTokenIntervalRef.current = intervalId;
        }

        return () => {
            if (checkForExpiringTokenIntervalRef.current) {
                logger.info('Clearing access token lifetime monitoring interval');
                clearInterval(checkForExpiringTokenIntervalRef.current);
            }
        };
    }, [tokenExpires]);

    // If we just got logged in we will need to fetch the bootstrap info (user info and authorized tenants)
    // Also we will setup an interval to check for expiring access tokens and refresh them
    useEffect(() => {
        if (!wasLoggedIn && isLoggedIn) {
            requestBootstrapInfo();
        }
    }, [isLoggedIn]);

    return (
        <React.Fragment>
            {application.isFetchingVersion ? (
                <Loader />
            ) : (
                <React.Fragment>
                    <NavMenu />

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
                                    {application.applicationVersion}
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
