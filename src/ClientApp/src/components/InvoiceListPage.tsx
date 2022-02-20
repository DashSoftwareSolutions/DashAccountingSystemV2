import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { isNil } from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import InvoiceLite from '../models/InvoiceLite';
import PagedResult from '../models/PagedResult';
import TenantBasePage from './TenantBasePage';
import * as InvoiceStore from '../store/Invoice';

const mapStateToProps = (state: ApplicationState) => {
    return {
        invoiceList: state.invoice?.list.results,
        isFetching: state.invoice?.list.isLoading,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

const mapDispatchToProps = {
    ...InvoiceStore.actionCreators,
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

        this.ensureDataFetched = this.ensureDataFetched.bind(this);
        this.onClickCreateInvoice = this.onClickCreateInvoice.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const {
            history,
            invoiceList,
            isFetching,
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
                    {isFetching ? (
                        <p>Loading...</p>
                    ) :
                        this.renderInvoiceList(invoiceList)
                    }
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        const {
            requestInvoiceList,
        } = this.props;

        requestInvoiceList();
    }

    private onClickCreateInvoice() {
        const {
            history,
            initializeNewInvoice,
        } = this.props;

        initializeNewInvoice();
        history.push('/invoice/new');
    }

    private renderInvoiceList(invoiceList: PagedResult<InvoiceLite>) {
        if (isNil(invoiceList) || invoiceList.total === 0) {
            return (
                <p>There are currently no invoices in the system.</p>
            );
        }

        return (
            <p>Invoice List is coming soon ...</p>
        );
    }
}

export default withRouter(
    connector(InvoiceListPage as any),
);