import * as React from 'react';
import {
    find,
    isEmpty,
    isNil,
    map,
} from 'lodash';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { DEFAULT_ASSET_TYPE } from '../common/Constants';
import { formatAddress } from '../common/StringUtils';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import Amount from '../models/Amount';
import AmountType from '../models/AmountType';
import AmountDisplay from './AmountDisplay';
import SelectTimeActivitiesForInvoicingModalDialog from './SelectTimeActivitiesForInvoicingModalDialog';
import TenantBasePage from './TenantBasePage';
import * as CustomerStore from '../store/Customer';
import * as InvoiceStore from '../store/Invoice';
import InvoiceLineItem from '../models/InvoiceLineItem';

const mapStateToProps = (state: ApplicationState) => {
    return {
        customers: state?.customers?.list.customers ?? [],
        customerDetails: state?.customers?.details.customer ?? null,
        dirtyInvoice: state.invoice?.details.dirtyInvoice,
        invoiceTermsOptions: state.invoice?.details.invoiceTermsOptions,
        isFetchingCustomerDetails: state?.customers?.details.isLoading ?? false,
        isFetchingCustomers: state.customers?.list.isLoading ?? false,
        isFetchingInvoiceTerms: state.invoice?.details.isLoadingInvoiceTerms ?? false,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

const mapDispatchToProps = {
    ...InvoiceStore.actionCreators,
    requestCustomerDetails: CustomerStore.actionCreators.requestCustomerDetails,
    requestCustomers: CustomerStore.actionCreators.requestCustomers,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type AddInvoicePageReduxProps = ConnectedProps<typeof connector>;

type AddInvoicePageProps = AddInvoicePageReduxProps
    & RouteComponentProps;

const DEFAULT_AMOUNT: Amount = {
    amount: 0,
    amountAsString: '0.00',
    amountType: AmountType.Debit,
    assetType: DEFAULT_ASSET_TYPE,
};

interface AddInvoicePageState {
    isSelectTimeActivitiesModalOpen: boolean;
}

class AddInvoicePage extends React.PureComponent<AddInvoicePageProps, AddInvoicePageState> {
    private logger: ILogger;
    private bemBlockName: string = 'add_invoice_page';

    constructor(props: AddInvoicePageProps) {
        super(props);

        this.logger = new Logger('Add Invoice Page');

        this.state = {
            isSelectTimeActivitiesModalOpen: false,
        };

        this.onClickAddUnbilledTime = this.onClickAddUnbilledTime.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
        this.onCloseAddUnbilledTimeModal = this.onCloseAddUnbilledTimeModal.bind(this);
        this.onCustomerAddressChanged = this.onCustomerAddressChanged.bind(this);
        this.onCustomerEmailChanged = this.onCustomerEmailChanged.bind(this);
        this.onCustomerSelectionChanged = this.onCustomerSelectionChanged.bind(this);
        this.onInvoiceDueDateChanged = this.onInvoiceDueDateChanged.bind(this);
        this.onInvoiceIssueDateChanged = this.onInvoiceIssueDateChanged.bind(this);
        this.onInvoiceMessageChanged = this.onInvoiceMessageChanged.bind(this);
        this.onInvoiceTermsSelectionChanged = this.onInvoiceTermsSelectionChanged.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate(prevProps: AddInvoicePageProps) {
        const {
            isFetchingCustomerDetails: wasFetchingCustomerDetails,
        } = prevProps;

        const {
            customerDetails,
            isFetchingCustomerDetails,
            updateCustomerAddress,
            updateCustomerEmail,
        } = this.props;

        if (wasFetchingCustomerDetails &&
            !isFetchingCustomerDetails &&
            !isNil(customerDetails)) {
            this.logger.info('Got the customer details!', customerDetails);
            const customerAddress = `${customerDetails.companyName}\n${formatAddress(customerDetails.billingAddress)}`;
            updateCustomerAddress(customerAddress);
            updateCustomerEmail(customerDetails.email);
        }
    }

    public render() {
        const {
            customers,
            dirtyInvoice,
            history,
            invoiceTermsOptions,
            selectedTenant,
        } = this.props;

        const {
            isSelectTimeActivitiesModalOpen,
        } = this.state;

        const amount: Amount = dirtyInvoice?.amount ?? DEFAULT_AMOUNT;

        const customerId = dirtyInvoice?.customerId ?? '';
        const customerAddress = dirtyInvoice?.customerAddress ?? '';
        const customerEmail = dirtyInvoice?.customerEmail ?? '';
        const invoiceTermsId = dirtyInvoice?.invoiceTermsId ?? '';
        const issueDate = dirtyInvoice?.issueDate ?? '';
        const dueDate = dirtyInvoice?.dueDate ?? '';
        const message = dirtyInvoice?.message ?? '';

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Invoicing}
                selectedTenant={selectedTenant ?? null}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col md={6}>
                            <h1>Create New Invoice</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button
                                color="secondary"
                                id={`${this.bemBlockName}--cancel_button`}
                                onClick={this.onClickCancel}
                                style={{ marginRight: 22, width: 88 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                id={`${this.bemBlockName}--save_button`}
                                onClick={this.onClickSave}
                                style={{ width: 88 }}
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <Form style={{ marginTop: 22 }}>
                        <Row form>
                            <Col sm={6} md={4}>
                                <Label for={`${this.bemBlockName}--customer_select`}>Customer</Label>
                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${this.bemBlockName}--customer_select`}
                                    name="customer_select"
                                    onChange={this.onCustomerSelectionChanged}
                                    placeholder="Select Customer"
                                    value={customerId ?? ''}
                                >
                                    <option value="">Select</option>
                                    {map(customers, (c) => ((
                                        <option key={`customer-${c.id}`} value={c.id}>
                                            {c.displayName}
                                        </option>
                                    )))}
                                </select>
                            </Col>
                            <Col sm={6} md={4}>
                                <Label for={`${this.bemBlockName}--customer_email_input`}>Customer Email</Label>
                                <Input
                                    id={`${this.bemBlockName}--customer_email_input`}
                                    name="customer_email_input"
                                    onChange={this.onCustomerEmailChanged}
                                    type="email"
                                    value={customerEmail}
                                />
                            </Col>
                            <Col sm={6} md={2}>
                                {!isEmpty(customerId) && (
                                    <Button
                                        color="success"
                                        className={`${this.bemBlockName}--add_unbilled_time_button`}
                                        id={`${this.bemBlockName}--add_unbilled_time_button`}
                                        onClick={this.onClickAddUnbilledTime}
                                        outline
                                    >
                                        Add Unbilled Time
                                    </Button>
                                )}
                            </Col>
                            <Col sm={6} md={2} className={`${this.bemBlockName}--balance_due_container`}>
                                <div className={`${this.bemBlockName}--balance_due_label`}>BALANCE DUE</div>
                                <AmountDisplay
                                    className={`${this.bemBlockName}--balance_due_amount`}
                                    amount={amount}
                                    showCurrency
                                />
                            </Col>
                        </Row>
                        <Row form className={`${this.bemBlockName}--second_row`}>
                            <Col sm={6} md={4}>
                                <Label for={`${this.bemBlockName}--customer_address_textarea`}>Customer Billing Address</Label>
                                <Input
                                    id={`${this.bemBlockName}--customer_address_textarea`}
                                    name="customer_address_textarea"
                                    onChange={this.onCustomerAddressChanged}
                                    type="textarea"
                                    value={customerAddress}
                                />
                            </Col>
                            <Col sm={6} md={2}>
                                <Label for={`${this.bemBlockName}--terms_select`}>Terms</Label>
                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${this.bemBlockName}--terms_select`}
                                    name="terms_select"
                                    onChange={this.onInvoiceTermsSelectionChanged}
                                    placeholder="Select Terms"
                                    value={invoiceTermsId ?? ''}
                                >
                                    <option value="">Select</option>
                                    {map(invoiceTermsOptions, (ito) => ((
                                        <option key={`terms-${ito.id}`} value={ito.id ?? ''}>
                                            {ito.name}
                                        </option>
                                    )))}
                                </select>
                            </Col>
                            <Col sm={6} md={2}>
                                <Label for={`${this.bemBlockName}--issue_date_input`}>Issue Date</Label>
                                <Input
                                    id={`${this.bemBlockName}--issue_date_input`}
                                    name="issue_date_input"
                                    onChange={this.onInvoiceIssueDateChanged}
                                    type="date"
                                    value={issueDate}
                                />
                            </Col>
                            <Col sm={6} md={2}>
                                <Label for={`${this.bemBlockName}--due_date_input`}>Date Date</Label>
                                <Input
                                    id={`${this.bemBlockName}--due_date_input`}
                                    name="due_date_input"
                                    onChange={this.onInvoiceDueDateChanged}
                                    type="date"
                                    value={dueDate}
                                />
                            </Col>
                        </Row>
                        <Row form className={`${this.bemBlockName}--line_items_table_container`}>
                            <Col sm={12}>
                                {this.renderInvoiceLineItems(dirtyInvoice?.lineItems ?? [])}
                            </Col>
                        </Row>
                        <Row form className={`${this.bemBlockName}--bottom_row`}>
                            <Col sm={6} md={4}>
                                <Label for={`${this.bemBlockName}--customer_address_textarea`}>Message on Invoice</Label>
                                <Input
                                    id={`${this.bemBlockName}--invoice_message_textarea`}
                                    name="invoice_message_textarea"
                                    onChange={this.onInvoiceMessageChanged}
                                    placeholder="This will show up on the invoice"
                                    type="textarea"
                                    value={message}
                                />
                            </Col>
                        </Row>
                    </Form>
                    <SelectTimeActivitiesForInvoicingModalDialog
                        isOpen={isSelectTimeActivitiesModalOpen}
                        onClose={this.onCloseAddUnbilledTimeModal}
                    />
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        const {
            requestCustomers,
            requestInvoiceTerms,
        } = this.props;

        requestCustomers();
        requestInvoiceTerms();
    }

    private onClickAddUnbilledTime() {
        this.logger.info('Open the modal dialog to select unbilled Time Activities to add to the Invoice...');
        this.setState({ isSelectTimeActivitiesModalOpen: true });
    }

    private onClickCancel() {
        const {
            history,
            resetDirtyInvoice,
        } = this.props;

        resetDirtyInvoice();
        history.push('/invoicing');
    }

    private onClickSave() {
        this.logger.info('Saving the invoice...');

        // TODO: Implement save
    }

    private onCloseAddUnbilledTimeModal(_: React.MouseEvent<any>) {
        this.setState({ isSelectTimeActivitiesModalOpen: false });
    }

    private onCustomerAddressChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateCustomerAddress } = this.props;
        updateCustomerAddress(event.currentTarget.value);
    }

    private onCustomerEmailChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateCustomerEmail } = this.props;
        updateCustomerEmail(event.currentTarget.value);
    }

    private onCustomerSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const {
            customers,
            customerDetails,
            requestCustomerDetails,
            updateCustomer,
            updateCustomerAddress,
            updateCustomerEmail,
        } = this.props;

        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateCustomer(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateCustomer(selectedOption.value);

        const customer = find(customers, (c) => c.id === selectedOption.value);

        if (!isNil(customer)) {
            if (!isNil(customerDetails) &&
                customerDetails.customerNumber === customer.customerNumber) {
                this.logger.info('Already had the customer details!', customerDetails);
                const customerAddress = `${customerDetails.companyName}\n${formatAddress(customerDetails.billingAddress)}`;
                updateCustomerAddress(customerAddress);
                updateCustomerEmail(customerDetails.email);
            } else {
                this.logger.info('Fetching the customer details ...');
                requestCustomerDetails(customer.customerNumber);
            }
        }
    }

    private onInvoiceDueDateChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateInvoiceDueDate } = this.props;
        updateInvoiceDueDate(event.currentTarget.value);
    }

    private onInvoiceIssueDateChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateInvoiceIssueDate } = this.props;
        updateInvoiceIssueDate(event.currentTarget.value);
    }

    private onInvoiceMessageChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateInvoiceMessage } = this.props;
        updateInvoiceMessage(event.currentTarget.value);
    }

    private onInvoiceTermsSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updateInvoiceTerms } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateInvoiceTerms(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateInvoiceTerms(selectedOption.value);
    }

    private renderInvoiceLineItems(lineItems: InvoiceLineItem[]): JSX.Element {
        return (
            <table className="table table-hover table-sm report-table">
                <thead>
                    <tr>
                        <th className="col-md-1 bg-white sticky-top sticky-border">#</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border">Service Date</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border">Product/Service</th>
                        <th className="col-md-4 bg-white sticky-top sticky-border">Description</th>
                        <th className="col-md-1 bg-white sticky-top sticky-border text-right">Qty</th>
                        <th className="col-md-1 bg-white sticky-top sticky-border text-right">Rate</th>
                        <th className="col-md-1 bg-white sticky-top sticky-border text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {map(lineItems, (li) => ((
                        <tr key={`line-item-${li.id ?? li.orderNumber.toString()}`}>
                            <td>{li.orderNumber}</td>
                            <td>{li.date}</td>
                            <td>{li.productOrService}</td>
                            <td>
                                <span
                                    dangerouslySetInnerHTML={{ __html: li.description?.replace(/\r?\n/g, '<br />') ?? '' }}
                                    style={{ wordWrap: 'break-word' }}
                                />
                            </td>
                            <td>{li.quantity}</td>
                            <td>
                                <AmountDisplay
                                    amount={li.unitPrice ?? DEFAULT_AMOUNT}
                                    showCurrency
                                />
                            </td>
                            <td>
                                <AmountDisplay
                                    amount={li.total ?? DEFAULT_AMOUNT}
                                    showCurrency
                                />
                            </td>
                        </tr>
                    )))}
                </tbody>
            </table>
        );
    }
}

export default withRouter(
    connector(AddInvoicePage as any),
);