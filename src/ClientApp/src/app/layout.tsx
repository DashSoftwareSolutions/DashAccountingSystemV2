import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import {
    useGetTenantsQuery,
    useGetUserInfoQuery,
} from './api';
import NavMenu from './navMenu';
import {
    ILogger,
    Logger
} from '../common/logging';
import SystemNotificationsArea from './systemNotificationsArea';

const logger: ILogger = new Logger('Layout');

function Layout() {
    const {
        data: userInfo,
        //error: userInfoFetchError,
        //isError: hasUserInfoError,
        isFetching: isFetchingUserInfo,
    } = useGetUserInfoQuery();

    const {
        //data: tenants,
        //error: tenantsFetchError,
        //isError: hasTenantsError,
        isFetching: isFetchingTenants,
    } = useGetTenantsQuery();

    logger.info('Is loading user info:', isFetchingUserInfo);
    logger.info('User info:', userInfo);

    const isLoading = isFetchingUserInfo || isFetchingTenants;

    return (
        <>
            {isLoading ? (
                <div id="app_loading_spinner" className="align-items-center justify-content-center" style={{ display: 'flex', height: 'calc(100vh - 250px)' }} >
                    <div className="spinner-border" role="status" style={{ width: '5rem', height: '5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ): (
                <>
                    <NavMenu userInfo = { userInfo } />
                    <Container>
                        <SystemNotificationsArea />
                        <Outlet />
                    </Container>
                </>
            )}
        </>
    );
}

export default Layout;