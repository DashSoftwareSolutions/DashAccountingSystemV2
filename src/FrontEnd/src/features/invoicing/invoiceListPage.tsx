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

const logger: ILogger = new Logger('Invoice List Page');
const bemBlockName: string = 'invoice_list_page';

const mapStateToProps = (state: ApplicationState) => ({
    selectedTenant: state.bootstrap.selectedTenant,
});

const connector = connect(mapStateToProps);

type InvoiceListPageReduxProps = ConnectedProps<typeof connector>;

type InvoiceListPageProps = InvoiceListPageReduxProps & RouteComponentProps;

function InvoiceListPage(props: InvoiceListPageProps) {
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
                TODO: Invoice List Page content
            </div>
        </React.Fragment>
    );
}

export default withRouter(connector(InvoiceListPage));
