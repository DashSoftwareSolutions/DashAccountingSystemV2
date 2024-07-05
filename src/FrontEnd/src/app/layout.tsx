import React, { useEffect } from 'react';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { Container } from 'reactstrap';
import { actionCreators as bootstrapActionCreators } from './bootstrap';
import NavMenu from './navMenu';
import { ApplicationState } from './store';
import SystemNotificationsArea from './systemNotificationsArea';
import Loader from '../common/components/loader';

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
        requestBootstrapInfo();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            {bootstrapInfo.isFetching ? (
                <Loader />
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
