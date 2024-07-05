import React, {
    useEffect,
    useState,
} from 'react';
import { Container } from 'reactstrap';
import NavMenu from './navMenu';
import {
    ILogger,
    Logger
} from '../common/logging';
import SystemNotificationsArea from './systemNotificationsArea';
import { BootstrapInfo } from '../common/models';

const logger: ILogger = new Logger('Layout');

function Layout(props: { children?: React.ReactNode }) {
    const [isFetching, setIsFetching] = useState<boolean>();
    const [bootstrapInfo, setBootstrapInfo] = useState<BootstrapInfo | null>(null);

    useEffect(() => {
        async function fetchBootstrap() {
            try {
                const response = await fetch('/api/bootstrap');

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const data = await response.json() as BootstrapInfo;
                logger.info('Boostrap Response:', data);
                setBootstrapInfo(data);
            } catch (error: any) {
                logger.error(error?.message ?? 'Error calling API');
            }
        }

        setIsFetching(true);

        fetchBootstrap()
            .catch((error: Error) => {
                logger.error(error.message);
            })
            .finally(() => {
                setIsFetching(false);
            });
    }, []);

    logger.info('Is fetching:', isFetching);
    logger.info('Bootstrap info in state:', bootstrapInfo);

    return (
        <>
            {isFetching ? (
                <div id="app_loading_spinner" className="align-items-center justify-content-center" style={{ display: 'flex', height: 'calc(100vh - 250px)' }} >
                    <div className="spinner-border" role="status" style={{ width: '5rem', height: '5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ): (
                <>
                    <NavMenu userInfo = {bootstrapInfo?.userInfo} />
                    <Container>
                        <SystemNotificationsArea />
                        {props.children}
                    </Container>
                </>
            )}
        </>
    );
}

export default Layout;
