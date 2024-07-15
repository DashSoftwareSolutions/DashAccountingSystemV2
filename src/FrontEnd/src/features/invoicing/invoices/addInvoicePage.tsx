import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { actionCreators as invoiceActionCreators } from './redux';
import { RootState } from '../../../app/globalReduxStore';
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';

const logger: ILogger = new Logger('Add Invoice Page');
const bemBlockName: string = 'add_invoice_page';

const mapStateToProps = (state: RootState) => ({
    isSaving: state.invoice.details.isSaving,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...invoiceActionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type DashboardPageReduxProps = ConnectedProps<typeof connector>;

type DashboardPageProps = DashboardPageReduxProps;

function DashboardPage(props: DashboardPageProps) {
    const {
        isSaving,
        resetDirtyInvoice,
        saveNewInvoice,
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

    const onClickCancel = () => {
        resetDirtyInvoice();
        navigate('/app/invoicing');
    };

    const onClickSave = () => {
        logger.info('Saving the invoice...');
        saveNewInvoice();
    };

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col md={6}>
                        <h1>Create New Invoice</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>

                    <Col
                        className="text-end"
                        md={6}
                    >
                        <Button
                            color="secondary"
                            id={`${bemBlockName}--cancel_button`}
                            onClick={onClickCancel}
                            style={{
                                marginRight: 22,
                                width: 88,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            color="success"
                            disabled={isSaving}
                            id={`${bemBlockName}--save_button`}
                            onClick={onClickSave}
                            style={{ width: 88 }}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                <p>TODO: Add Invoice Page content</p>
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(DashboardPage);
