import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import {
    isNil,
    map,
} from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import AmountDisplay from './AmountDisplay';
import InvoiceLite from '../models/InvoiceLite';
import LinkButton from './LinkButton';
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
        this.onClickExistingInvoice = this.onClickExistingInvoice.bind(this);
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
                selectedTenant={selectedTenant ?? null}
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
                    ) : !isNil(invoiceList) ?
                        this.renderInvoiceList(invoiceList)
                    : <React.Fragment />}
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

    private onClickExistingInvoice(invoice: InvoiceLite) {
        const {
            history,
        } = this.props;

        history.push(`/invoice/view/${invoice.invoiceNumber}`);
    }

    private renderInvoiceList(invoiceList: PagedResult<InvoiceLite>) {
        if (isNil(invoiceList) || invoiceList.total === 0) {
            return (
                <p>There are currently no invoices in the system.</p>
            );
        }

        // TODO: Pagination Controls if necessary

        return (
            <table className="table table-hover table-sm report-table">
                <thead>
                    <tr>
                        <th className="col-md-1 bg-white sticky-top sticky-border">{'Invoice\u00A0Date'}</th>
                        <th className="col-md-1 bg-white sticky-top sticky-border">Invoice #</th>
                        <th className="col-md-3 bg-white sticky-top sticky-border">Customer</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Amount</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border">Status</th>
                        <th className="col-md-1 bg-white sticky-top sticky-border">Due</th>
                        <th className="col-md-1 bg-white sticky-top sticky-border">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {map(invoiceList.results, (invoice) => ((
                        <tr key={invoice.id}>
                            <td className="col-md-1">
                                <LinkButton
                                    className="btn-link-report-item"
                                    onClick={() => this.onClickExistingInvoice(invoice)}
                                >
                                    {moment(invoice.issueDate).format('L')}
                                </LinkButton>
                            </td>
                            <td className="col-md-1">
                                <LinkButton
                                    className="btn-link-report-item"
                                    onClick={() => this.onClickExistingInvoice(invoice)}
                                >
                                    {invoice.invoiceNumber}
                                </LinkButton>
                            </td>
                            <td className="col-md-3">
                                <LinkButton
                                    className="btn-link-report-item"
                                    onClick={() => this.onClickExistingInvoice(invoice)}
                                >
                                    {invoice.customerName}
                                </LinkButton>
                            </td>
                            <td className="col-md-2 text-right">
                                <LinkButton
                                    className="btn-link-report-item"
                                    onClick={() => this.onClickExistingInvoice(invoice)}
                                >
                                    <AmountDisplay
                                        amount={invoice.amount}
                                        showCurrency
                                    />
                                </LinkButton>
                            </td>
                            <td className="col-md-2">
                                <LinkButton
                                    className="btn-link-report-item"
                                    onClick={() => this.onClickExistingInvoice(invoice)}
                                >
                                    {invoice.status}
                                </LinkButton>
                            </td>
                            <td className="col-md-1">
                                <LinkButton
                                    className="btn-link-report-item"
                                    onClick={() => this.onClickExistingInvoice(invoice)}
                                >
                                    {moment(invoice.dueDate).format('L')}
                                </LinkButton>
                            </td>
                            <td>
                                &nbsp;
                            </td>
                        </tr>
                    )))}
                </tbody>
            </table>
        );
    }
}

export default withRouter(
    connector(InvoiceListPage as any),
);