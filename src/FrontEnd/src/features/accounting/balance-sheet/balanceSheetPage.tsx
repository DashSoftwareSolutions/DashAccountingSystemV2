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
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';

const logger: ILogger = new Logger('Balance Sheet Page');
const bemBlockName: string = 'balance_sheet_page';

const mapStateToProps = (state: RootState) => ({
    selectedTenant: state.application.selectedTenant,
});

const connector = connect(mapStateToProps);

type BalanceSheetPageReduxProps = ConnectedProps<typeof connector>;

type BalanceSheetPageProps = BalanceSheetPageReduxProps;

function BalanceSheetPage(props: BalanceSheetPageProps) {
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
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col>
                        <h1>Balance Sheet</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                TODO: Balance Sheet
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(BalanceSheetPage);
