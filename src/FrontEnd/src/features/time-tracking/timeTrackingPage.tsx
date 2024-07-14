import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Col,
    Row,
} from 'reactstrap';
import { RootState } from '../../app/globalReduxStore';
import {
    ILogger,
    Logger,
} from '../../common/logging';

const logger: ILogger = new Logger('Time Tracking Page');
const bemBlockName: string = 'time_tracking_page';

const mapStateToProps = (state: RootState) => ({
    selectedTenant: state.application.selectedTenant,
});

const connector = connect(mapStateToProps);

type TimeTrackingPageReduxProps = ConnectedProps<typeof connector>;

type TimeTrackingPageProps = TimeTrackingPageReduxProps;

function TimeTrackingPage(props: TimeTrackingPageProps) {
    const {
        selectedTenant,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
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

export default connector(TimeTrackingPage);
