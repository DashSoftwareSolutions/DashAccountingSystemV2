import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import SystemNotificationsArea from './SystemNotificationsArea';

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <NavMenu />
        <Container>
            <SystemNotificationsArea />
            {props.children}
        </Container>
    </React.Fragment>
);
