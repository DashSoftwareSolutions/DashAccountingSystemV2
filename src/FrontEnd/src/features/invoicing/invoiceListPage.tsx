import { isNil } from 'lodash';
import React, { useEffect } from 'react';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import {
    ConnectedProps,
    connect,
    useDispatch,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootState } from '../../app/globalReduxStore';
import IAction from '../../app/globalReduxStore/action.interface';
import MainPageContent from '../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../common/logging';
import { apiErrorHandler } from '../../common/utilities/errorHandling';

const logger: ILogger = new Logger('Invoice List Page');
const bemBlockName: string = 'invoice_list_page';

const mapStateToProps = (state: RootState) => ({
    selectedTenant: state.application.selectedTenant,
});

const connector = connect(mapStateToProps);

type InvoiceListPageReduxProps = ConnectedProps<typeof connector>;

type InvoiceListPageProps = InvoiceListPageReduxProps;

function InvoiceListPage(props: InvoiceListPageProps) {
    const {
        selectedTenant,
    } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [selectedTenant]);

    const onClick500 = (() => {
        fetch('/api/test-errors/problem-500')
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                }
            });
    });

    const oncClick400 = (() => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch('/api/test-errors/request-validation', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                }
            });
    });

    return (
        <React.Fragment>
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col>
                        <h1>Invoices</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                <p>TODO: Invoice List Page content</p>
                <Button color="danger" onClick={onClick500}>Test 500 Error Toast</Button>
                <br />
                <br />
                <Button color="warning" onClick={oncClick400}>Test Validation Error Toast</Button>
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(InvoiceListPage);
