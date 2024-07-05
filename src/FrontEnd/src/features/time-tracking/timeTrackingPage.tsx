import { isNil } from 'lodash';
import React, { useEffect } from 'react';
import {
    Col,
    Row,
} from 'reactstrap';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    RouteComponentProps,
    withRouter,
} from 'react-router';
import { ApplicationState } from '../../app/store';
import NavigationSection from '../../app/navigationSection';
import TenantSubNavigation from '../../app/tenantSubNavigation';
import {
    ILogger,
    Logger,
} from '../../common/logging';

const logger: ILogger = new Logger('Time Tracking Page');
const bemBlockName: string = 'time_tracking_page';

const mapStateToProps = (state: ApplicationState) => ({
    selectedTenant: state.bootstrap.selectedTenant,
});

const connector = connect(mapStateToProps);

type TimeTrackingPageReduxProps = ConnectedProps<typeof connector>;

type TimeTrackingPageProps = TimeTrackingPageReduxProps & RouteComponentProps;

function TimeTrackingPage(props: TimeTrackingPageProps) {
    const {
        history,
        selectedTenant,
    } = props;

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            history.push('/');
        }
    }, [
        history,
        selectedTenant,
    ]);

    return (
        <React.Fragment>
            <TenantSubNavigation activeSection={NavigationSection.TimeTracking} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col>
                        <h1>Time Activities Report</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                TODO: Time Activities Report
            </div>
        </React.Fragment>
    );
}

export default withRouter(connector(TimeTrackingPage));