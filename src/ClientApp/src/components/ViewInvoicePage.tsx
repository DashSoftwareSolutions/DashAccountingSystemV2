import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    ListGroup,
    ListGroupItem,
    Row,
} from 'reactstrap';
import {
    isNil,
} from 'lodash';
import moment from 'moment-timezone';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import AmountDisplay from './AmountDisplay';
import InvoiceLineItemsTable from './InvoiceLineItemsTable';
import InvoiceStatusLabel from './InvoiceStatusLabel';
import TenantBasePage from './TenantBasePage';
import * as InvoiceStore from '../store/Invoice';

const mapStateToProps = (state: ApplicationState) => {
    return {
        invoice: state.invoice?.details.existingInvoice ?? null,
        isFetching: state.invoice?.details.isLoadingInvoice ?? false,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

const mapDispatchToProps = {
    requestInvoice: InvoiceStore.actionCreators.requestInvoice,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ViewInvoicePageReduxProps = ConnectedProps<typeof connector>;

type ViewInvoicePageProps = ViewInvoicePageReduxProps
    & RouteComponentProps<{ invoiceNumber: string }>;

class ViewInvoicePage extends React.PureComponent<ViewInvoicePageProps> {
    private logger: ILogger;
    private bemBlockName: string = 'view_invoice_page';

    constructor(props: ViewInvoicePageProps) {
        super(props);

        this.logger = new Logger('View Invoice Page');

        this.onClickBack = this.onClickBack.bind(this);
        this.onClickEditInvoice = this.onClickEditInvoice.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
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
                selectedTenant={selectedTenant ?? null}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col md={5}>
                            <h1>Invoice Details</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col className="text-right" md={7}>
                            <Button
                                color="secondary"
                                id={`${this.bemBlockName}--back_button`}
                                onClick={this.onClickBack}
                                style={{ marginRight: 22, width: 88 }}
                            >
                                Back
                            </Button>
                            <Button
                                color="primary"
                                id={`${this.bemBlockName}--edit_button`}
                                onClick={this.onClickEditInvoice}
                                style={{ width: 88 }}
                            >
                                Edit
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    {this.renderInvoice()}
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private onClickBack() {
        const {
            history,
        } = this.props;

        // TODO: Dispatch reset action

        history.push('/invoicing');
    }

    private onClickEditInvoice() {
        this.logger.debug('Editing the invoice...');

        // TODO: Implement edit invoice action
    }

    private ensureDataFetched() {
        const {
            match: {
                params: { invoiceNumber },
            },
            requestInvoice,
        } = this.props;

        const parsedInvoiceNumber = parseInt(invoiceNumber, 10) || 0;
        requestInvoice(parsedInvoiceNumber);
    }

    private renderInvoice(): JSX.Element {
        const {
            isFetching,
            invoice,
        } = this.props;

        if (isFetching) {
            return (
                <p>{/* TODO: Some spinner or whatever */}Loading...</p>
            );
        }

        if (isNil(invoice)) {
            return (<React.Fragment />);
        }

        const issueDateMoment = moment(invoice.issueDate);
        const dueDateMoment = moment(invoice.dueDate);
        const isPastDue = dueDateMoment.isAfter(moment(), 'day');

        return (
            <React.Fragment>
                <ListGroup>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Invoice #</strong></Col>
                            <Col md={4}>{invoice.invoiceNumber}</Col>
                            <Col md={2}><strong>Amount</strong></Col>
                            <Col md={4}>
                                {!isNil(invoice.amount) && (
                                    <AmountDisplay
                                        amount={invoice.amount}
                                        showCurrency
                                    />
                                )}
                            </Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Status</strong></Col>
                            <Col md={4}>
                                <InvoiceStatusLabel isPastDue={isPastDue} status={invoice.status} />
                            </Col>
                            <Col md={2}><strong>Terms</strong></Col>
                            <Col md={4}>{invoice.invoiceTerms?.name}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Issue Date</strong></Col>
                            <Col md={4}>{issueDateMoment.format('L')}</Col>
                            <Col md={2}><strong>Due Date</strong></Col>
                            <Col md={4}>{dueDateMoment.format('L')}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Customer</strong></Col>
                            <Col md={10}>{invoice.customer?.displayName}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Col md={2}><strong>Message</strong></Col>
                        <Col md={10}>
                            {!isNil(invoice.message) && (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: invoice.message.replace(/\n/g, '<br />'),
                                    }}
                                />
                            )}
                        </Col>
                    </ListGroupItem>
                </ListGroup>
                <div style={{ marginTop: 22 }}>
                    <InvoiceLineItemsTable lineItems={invoice.lineItems} />
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(
    connector(ViewInvoicePage as any),
);