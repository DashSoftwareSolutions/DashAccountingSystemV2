import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import NavMenu from './nav-menu';
import SystemNotificationsArea from './system-notifications-area';

function Layout() {
    return (
        <>
            <NavMenu />
            <Container>
                <SystemNotificationsArea />
                <Outlet />
            </Container>
        </>
    );
}

export default Layout;