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
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/globalReduxStore';
import {
    ILogger,
    Logger,
} from '../../common/logging';

const logger: ILogger = new Logger('Dashboard Page');
const bemBlockName: string = 'dashboard_page';

const mapStateToProps = (state: RootState) => ({
    selectedTenant: state.application.selectedTenant,
});

const connector = connect(mapStateToProps);

type DashboardPageReduxProps = ConnectedProps<typeof connector>;

type DashboardPageProps = DashboardPageReduxProps;

function DashboardPage(props: DashboardPageProps) {
    const {
        selectedTenant,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [selectedTenant]);

    return (
        <React.Fragment>
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col>
                        <h1>{selectedTenant?.name}</h1>
                        <p className="page_header--subtitle">Dashboard</p>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                <p>Coming soon...</p>
            </div>
        </React.Fragment>
    );
}

export default connector(DashboardPage);
