import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
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
import InvoiceStatus from '../models/InvoiceStatus';

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

type ViewInvoicePageState = {
    isConfirmDeleteInvoiceModalOpen: boolean;
    isConfirmSendInvoiceModalOpen: boolean;
};

class ViewInvoicePage extends React.PureComponent<ViewInvoicePageProps, ViewInvoicePageState> {
    private logger: ILogger;
    private bemBlockName: string = 'view_invoice_page';

    constructor(props: ViewInvoicePageProps) {
        super(props);

        this.logger = new Logger('View Invoice Page');

        this.state = {
            isConfirmDeleteInvoiceModalOpen: false,
            isConfirmSendInvoiceModalOpen: false,
        }

        this.onClickBack = this.onClickBack.bind(this);
        this.onClickDeleteInvoice = this.onClickDeleteInvoice.bind(this);
        this.onClickDownloadPdf = this.onClickDownloadPdf.bind(this);
        this.onClickEditInvoice = this.onClickEditInvoice.bind(this);
        this.onClickReceivePayment = this.onClickReceivePayment.bind(this);
        this.onClickSendInvoice = this.onClickSendInvoice.bind(this);
        this.onClickViewPayment = this.onClickViewPayment.bind(this);
        this.onDeleteInvoiceConfirmed = this.onDeleteInvoiceConfirmed.bind(this);
        this.onDeleteInvoiceDeclined = this.onDeleteInvoiceDeclined.bind(this);
        this.onSendInvoiceConfirmed = this.onSendInvoiceConfirmed.bind(this);
        this.onSendInvoiceDeclined = this.onSendInvoiceDeclined.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const {
            history,
            invoice,
            selectedTenant,
        } = this.props;

        const {
            isConfirmDeleteInvoiceModalOpen,
            isConfirmSendInvoiceModalOpen,
        } = this.state;

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
                            {/* We always get a Back button */}
                            <Button
                                color="secondary"
                                id={`${this.bemBlockName}--back_button`}
                                onClick={this.onClickBack}
                                style={{ marginRight: 22, width: 88 }}
                            >
                                Back
                            </Button>

                            {/* We always get a Download PDF button */}
                            <Button
                                color="primary"
                                id={`${this.bemBlockName}--download_button`}
                                onClick={this.onClickDownloadPdf}
                                style={{ marginRight: 22, width: 150 }}
                            >
                                Download PDF
                            </Button>

                            {invoice?.status === InvoiceStatus.Draft && (
                                <React.Fragment>
                                    <Button
                                        color="success"
                                        id={`${this.bemBlockName}--send_button`}
                                        onClick={this.onClickSendInvoice}
                                        style={{ marginRight: 22, width: 88 }}
                                    >
                                        Send
                                    </Button>

                                    <Button
                                        color="primary"
                                        id={`${this.bemBlockName}--edit_button`}
                                        onClick={this.onClickEditInvoice}
                                        style={{ marginRight: 22, width: 88 }}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        color="danger"
                                        id={`${this.bemBlockName}--delete_button`}
                                        onClick={this.onClickDeleteInvoice}
                                        style={{ width: 88 }}
                                    >
                                        Delete
                                    </Button>
                                </React.Fragment>
                            )}

                            {invoice?.status === InvoiceStatus.Sent && (
                                <React.Fragment>
                                    <Button
                                        color="success"
                                        id={`${this.bemBlockName}--receive_payment_button`}
                                        onClick={this.onClickReceivePayment}
                                        style={{ width: 150 }}
                                    >
                                        Receive Payment
                                    </Button>
                                </React.Fragment>
                            )}

                            {invoice?.status === InvoiceStatus.Paid && (
                                <React.Fragment>
                                    <Button
                                        color="success"
                                        id={`${this.bemBlockName}--view_payment_button`}
                                        onClick={this.onClickViewPayment}
                                        style={{ width: 150 }}
                                    >
                                        View Payment
                                    </Button>
                                </React.Fragment>
                            )}
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
        // TODO: Dispatch reset action if needed
        const { history } = this.props;
        history.goBack();
    }

    private onClickDeleteInvoice() {
        this.logger.debug('Deleting the invoice...');

        // TODO: Open the modal 'Are you sure?' prompt for deleting
    }

    private onClickDownloadPdf() {
        this.logger.debug('Downloading the PDF Invoice ...');

        // TODO: Implement downlaod PDF invoice action
    }

    private onClickEditInvoice() {
        this.logger.debug('Editing the invoice...');

        // TODO: Implement edit invoice action
    }

    private onClickReceivePayment() {
        this.logger.debug('Receiving payment for the invoice...');

        // TODO: Implement receive payment action
    }

    private onClickSendInvoice() {
        this.logger.debug('Sending the invoice...');

        // TODO: Open the modal 'Are you sure?' prompt for sending
    }

    private onClickViewPayment() {
        this.logger.debug('Viewing the payment...');

        // TODO: Implement view payment action
    }

    private onDeleteInvoiceConfirmed() {
        this.logger.debug('We\'re sure we want to delete the invoice.  Doing it...');

        // TODO: Implement delete invoice action
    }

    private onDeleteInvoiceDeclined() {
        this.logger.debug('Just kidding.  Don\'t delete it!');

        // TODO: Close the modal 'Are you sure?' prompt for deleting
    }

    private onSendInvoiceConfirmed() {
        this.logger.debug('We\'re sure we want to send the invoice.  Doing it...');

        // TODO: Implement delete invoice action
    }

    private onSendInvoiceDeclined() {
        this.logger.debug('Just kidding.  Don\'t send it yet!');

        // TODO: Close the modal 'Are you sure?' prompt for sending
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
        const isPastDue = dueDateMoment.isBefore(moment(), 'day');

        return (
            <React.Fragment>
                <ListGroup>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Invoice #</strong></Col>
                            <Col md={2}>{invoice.invoiceNumber}</Col>
                            <Col md={2}><strong>Amount</strong></Col>
                            <Col md={2}>
                                {!isNil(invoice.amount) && (
                                    <AmountDisplay
                                        amount={invoice.amount}
                                        showCurrency
                                    />
                                )}
                            </Col>
                            <Col md={2}><strong>Status</strong></Col>
                            <Col md={2}>
                                <InvoiceStatusLabel isPastDue={isPastDue} status={invoice.status} />
                            </Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Issue Date</strong></Col>
                            <Col md={2}>{issueDateMoment.format('L')}</Col>
                            <Col md={2}><strong>Terms</strong></Col>
                            <Col md={2}>{invoice.invoiceTerms?.name}</Col>
                            <Col md={2}><strong>Due Date</strong></Col>
                            <Col md={2}>{dueDateMoment.format('L')}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Customer</strong></Col>
                            <Col md={10}>{invoice.customer?.displayName}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
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
                        </Row>
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