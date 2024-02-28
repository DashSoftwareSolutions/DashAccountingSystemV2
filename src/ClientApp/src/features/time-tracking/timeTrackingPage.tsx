import { isNil } from 'lodash';
import {
    useCallback,
    useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import {
    ILogger,
    Logger
} from '../../common/logging';
import NavigationSection from '../../app/navigationSection';
import TenantSubNavigation from '../../app/tenantSubNavigation';
import { selectSelectedTenant } from '../../app/tenantsSlice';
import {
    useTypedSelector,
} from '../../app/store';

const logger: ILogger = new Logger('Time Tracking Page');
const bemBlockName: string = 'time_tracking_page';

function TimeTrackingPage() {
    const navigate = useNavigate();
    const selectedTenant = useTypedSelector(selectSelectedTenant);

    const onClickNewTimeActivity = useCallback(() => {
        logger.info('New Time Activity button clicked!');
    }, []);

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    return (
        <>
            <TenantSubNavigation activeSection={NavigationSection.TimeTracking} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={6}>
                        <h1>Time Tracking</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col md={6} style={{ textAlign: 'right' }}>
                        <Button color="primary" onClick={onClickNewTimeActivity}>
                            New Time Activity
                        </Button>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                <p>Coming soon...</p>
            </div>
        </>
    );
}

export default TimeTrackingPage;