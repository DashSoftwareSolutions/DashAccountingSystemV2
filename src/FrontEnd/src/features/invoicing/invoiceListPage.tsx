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
import { ApplicationState } from '../../app/store';
import IAction from '../../app/store/action.interface';
import NavigationSection from '../../app/navigationSection';
import TenantSubNavigation from '../../app/tenantSubNavigation';
import {
    ILogger,
    Logger,
} from '../../common/logging';
import { apiErrorHandler } from '../../common/utilities/errorHandling';

const logger: ILogger = new Logger('Invoice List Page');
const bemBlockName: string = 'invoice_list_page';

const mapStateToProps = (state: ApplicationState) => ({
    selectedTenant: state.bootstrap.selectedTenant,
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

    const onClick = (() => {
        fetch('/api/test-errors/problem-500')
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                }
            });
    });

    return (
        <React.Fragment>
            <TenantSubNavigation activeSection={NavigationSection.Invoicing} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col>
                        <h1>Invoices</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                <p>TODO: Invoice List Page content</p>
                <Button onClick={onClick}>Test Error Toast</Button>
            </div>
        </React.Fragment>
    );
}

export default connector(InvoiceListPage);
