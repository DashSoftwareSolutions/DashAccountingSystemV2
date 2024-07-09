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
import { RootState } from '../../../app/globalReduxStore';
import {
    ILogger,
    Logger,
} from '../../../common/logging';

const logger: ILogger = new Logger('Profit & Loss Page');
const bemBlockName: string = 'profit_and_loss_page';

const mapStateToProps = (state: RootState) => ({
    selectedTenant: state.application.selectedTenant,
});

const connector = connect(mapStateToProps);

type ProfitAndLossPageReduxProps = ConnectedProps<typeof connector>;

type ProfitAndLossPageProps = ProfitAndLossPageReduxProps;

function ProfitAndLossPage(props: ProfitAndLossPageProps) {
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
                        <h1>Profit &amp; Loss</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                TODO: Profit &amp; Loss
            </div>
        </React.Fragment>
    );
}

export default connector(ProfitAndLossPage);
