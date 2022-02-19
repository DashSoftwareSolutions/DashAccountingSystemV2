import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import TenantBasePage from './TenantBasePage';

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

const mapDispatchToProps = {
    // TODO: Map needed action creators
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type InvoiceListPageReduxProps = ConnectedProps<typeof connector>;

type InvoiceListPagePageProps = InvoiceListPageReduxProps
    & RouteComponentProps;

class InvoiceListPage extends React.PureComponent<InvoiceListPagePageProps> {
    private logger: ILogger;
    private bemBlockName: string = 'invoice_list_page';

    constructor(props: InvoiceListPagePageProps) {
        super(props);

        this.logger = new Logger('Invoice List Page');

        this.onClickCreateInvoice = this.onClickCreateInvoice.bind(this);
    }

    public render() {
        const {
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Invoicing}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col md={6}>
                            <h1>Invoices</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button color="primary" onClick={this.onClickCreateInvoice}>
                                Create Invoice
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <p>Coming Soon...</p>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private onClickCreateInvoice() {
        // TODO: Dispatch an initialize action if necessary
        const { history } = this.props;
        history.push('/invoice/new');
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(InvoiceListPage as any),
);