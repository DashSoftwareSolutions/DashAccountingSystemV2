import React, {
    useCallback,
    useEffect,
} from 'react';
import {
    isEmpty,
    isNil,
} from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col,
    Form,
    Input,
    Label,
    Row,
} from 'reactstrap';
import InvoiceLineItemsTable from './invoiceLineItemsTable';
import { actionCreators as invoiceActionCreators } from './redux';
import SelectTimeActivitiesForInvoicingModalDialog from './selectTimeActivitiesForInvoicingModalDialog';
import { RootState } from '../../../app/globalReduxStore';
import {
    actionCreators as notificationActionCreators,
    NotificationLevel,
} from '../../../app/notifications';
import AmountDisplay from '../../../common/components/amountDisplay';
import MainPageContent from '../../../common/components/mainPageContent';
import { DEFAULT_AMOUNT } from '../../../common/constants';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import { Amount } from '../../../common/models';
import { formatAddress } from '../../../common/utilities/stringUtils';
import useNamedState from '../../../common/utilities/useNamedState';
import usePrevious from '../../../common/utilities/usePrevious';
import { actionCreators as customerActionCreators } from '../../sales/customers/redux';

const logger: ILogger = new Logger('Add Invoice Page');
const bemBlockName: string = 'add_invoice_page';

const mapStateToProps = (state: RootState) => ({
    customers: state.customers.list.customers,
    customerDetails: state.customers.details.customer,
    dirtyInvoice: state.invoice?.details.dirtyInvoice,
    invoiceTermsOptions: state.invoice.details.invoiceTermsOptions,
    isFetchingCustomerDetails: state.customers.details.isFetching,
    isFetchingCustomers: state.customers.list.isFetching,
    isFetchingInvoiceTerms: state.invoice.details.isFetchingInvoiceTerms,
    isSaving: state.invoice.details.isSaving,
    savedInvoice: state.invoice.details.existingInvoice,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...invoiceActionCreators,
    requestCustomerDetails: customerActionCreators.requestCustomerDetails,
    requestCustomers: customerActionCreators.requestCustomers,
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type AddInvoicePageReduxProps = ConnectedProps<typeof connector>;

type AddInvoicePageProps = AddInvoicePageReduxProps;

function AddInvoicePage(props: AddInvoicePageProps) {
    const {
        customers,
        customerDetails,
        dirtyInvoice,
        invoiceTermsOptions,
        isFetchingCustomerDetails,
        isSaving,
        requestCustomers,
        requestCustomerDetails,
        requestInvoiceTerms,
        resetDirtyInvoice,
        resetInvoiceList,
        savedInvoice,
        saveNewInvoice,
        selectedTenant,
        showAlert,
        updateCustomer,
        updateCustomerAddress,
        updateCustomerEmail,
        updateInvoiceDueDate,
        updateInvoiceIssueDate,
        updateInvoiceMessage,
        updateInvoiceTerms,
    } = props;

    const wasFetchingCustomerDetails = usePrevious(isFetchingCustomerDetails);
    const wasSaving = usePrevious(isSaving);

    const [isSelectTimeActivitiesModalOpen, setIsSelectTimeActivitiesModalOpen] = useNamedState<boolean>('isSelectTimeActivitiesModalOpen', false);

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

    // component did mount - fetch the data
    useEffect(() => {
        requestCustomers();
        requestInvoiceTerms();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // component did update - handle receipt of customer data
    useEffect(() => {
        if (wasFetchingCustomerDetails &&
            !isFetchingCustomerDetails &&
            !isNil(customerDetails)) {
            const customerAddress = `${customerDetails.companyName}\n${formatAddress(customerDetails.billingAddress)}`;
            updateCustomerAddress(customerAddress);
            updateCustomerEmail(customerDetails.email);
        }
    }, [
        customerDetails,
        isFetchingCustomerDetails,
        updateCustomerAddress,
        updateCustomerEmail,
        wasFetchingCustomerDetails,
    ]);

    // component did update -- handle finish saving
    useEffect(() => {
        if (wasSaving &&
            !isSaving &&
            !isNil(savedInvoice)) {
            showAlert(NotificationLevel.Success, `Successfully created Invoice # ${savedInvoice.invoiceNumber}`, true);
            resetDirtyInvoice();
            resetInvoiceList();
            navigate('/app/invoicing'); // TODO/FIXME: May go to view details page for the new Invoice instead
        }
    }, [
        isSaving,
        navigate,
        resetDirtyInvoice,
        resetInvoiceList,
        savedInvoice,
        showAlert,
        wasSaving,
    ]);

    const onClickAddUnbilledTime = () => {
        setIsSelectTimeActivitiesModalOpen(true);
    };

    const onClickCancel = () => {
        resetDirtyInvoice();
        navigate('/app/invoicing');
    };

    const onClickSave = () => {
        logger.info('Saving the invoice...');
        saveNewInvoice();
    };

    const onCloseAddUnbilledTimeModal = (_: React.MouseEvent<any>) => {
        setIsSelectTimeActivitiesModalOpen(false);
    };

    const onCustomerAddressChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateCustomerAddress(event.currentTarget.value);
    };

    const onCustomerEmailChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateCustomerEmail(event.currentTarget.value);
    };

    const onCustomerSelectionChanged = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateCustomer(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateCustomer(selectedOption.value);

        const customer = customers.find((c) => c.id === selectedOption.value);

        if (!isNil(customer)) {
            if (!isNil(customerDetails) &&
                customerDetails.customerNumber === customer.customerNumber) {
                logger.info('Already had the customer details!', customerDetails);
                const customerAddress = `${customerDetails.companyName}\n${formatAddress(customerDetails.billingAddress)}`;
                updateCustomerAddress(customerAddress);
                updateCustomerEmail(customerDetails.email);
            } else {
                logger.info('Fetching the customer details ...');
                requestCustomerDetails(customer.customerNumber);
            }
        }
    }, [
        customers,
        customerDetails,
        requestCustomerDetails,
        updateCustomer,
        updateCustomerAddress,
        updateCustomerEmail,
    ]);

    const onInvoiceDueDateChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateInvoiceDueDate(event.currentTarget.value);
    };

    const onInvoiceIssueDateChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateInvoiceIssueDate(event.currentTarget.value);
    };

    const onInvoiceMessageChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateInvoiceMessage(event.currentTarget.value);
    };

    const onInvoiceTermsSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateInvoiceTerms(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateInvoiceTerms(selectedOption.value);
    };

    const amount: Amount = dirtyInvoice?.amount ?? DEFAULT_AMOUNT;

    const customerId = dirtyInvoice?.customerId ?? '';
    const customerAddress = dirtyInvoice?.customerAddress ?? '';
    const customerEmail = dirtyInvoice?.customerEmail ?? '';
    const invoiceTermsId = dirtyInvoice?.invoiceTermsId ?? '';
    const issueDate = dirtyInvoice?.issueDate ?? '';
    const dueDate = dirtyInvoice?.dueDate ?? '';
    const message = dirtyInvoice?.message ?? '';

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
                <Form style={{ marginTop: 22 }}>
                    <Row>
                        <Col
                            md={4}
                            sm={6}
                        >
                            <Label for={`${bemBlockName}--customer_select`}>Customer</Label>

                            <select
                                className="selectpicker form-control"
                                data-width="auto"
                                id={`${bemBlockName}--customer_select`}
                                name="customer_select"
                                onChange={onCustomerSelectionChanged}
                                value={customerId ?? ''}
                            >
                                <option value="">Select Customer</option>

                                {customers.map((c) => ((
                                    <option
                                        key={`customer-${c.id}`}
                                        value={c.id}
                                    >
                                        {c.displayName}
                                    </option>
                                )))}
                            </select>
                        </Col>

                        <Col
                            md={4}
                            sm={6}
                        >
                            <Label for={`${bemBlockName}--customer_email_input`}>Customer Email</Label>

                            <Input
                                id={`${bemBlockName}--customer_email_input`}
                                name="customer_email_input"
                                onChange={onCustomerEmailChanged}
                                type="email"
                                value={customerEmail}
                            />
                        </Col>

                        <Col
                            md={2}
                            sm={6}
                        >
                            {!isEmpty(customerId) && (
                                <Button
                                    className={`${bemBlockName}--add_unbilled_time_button`}
                                    color="success"
                                    id={`${bemBlockName}--add_unbilled_time_button`}
                                    onClick={onClickAddUnbilledTime}
                                    outline
                                >
                                    Add Unbilled Time
                                </Button>
                            )}
                        </Col>

                        <Col
                            className={`${bemBlockName}--balance_due_container`}
                            md={2}
                            sm={6}
                        >
                            <div className={`${bemBlockName}--balance_due_label`}>BALANCE DUE</div>

                            <AmountDisplay
                                amount={amount}
                                className={`${bemBlockName}--balance_due_amount`}
                                showCurrency
                            />
                        </Col>
                    </Row>

                    <Row
                        className={`${bemBlockName}--second_row`}
                        form
                    >
                        <Col
                            md={4}
                            sm={6}
                        >
                            <Label for={`${bemBlockName}--customer_address_textarea`}>Customer Billing Address</Label>

                            <Input
                                id={`${bemBlockName}--customer_address_textarea`}
                                name="customer_address_textarea"
                                onChange={onCustomerAddressChanged}
                                type="textarea"
                                value={customerAddress}
                            />
                        </Col>

                        <Col
                            md={2}
                            sm={6}
                        >
                            <Label for={`${bemBlockName}--terms_select`}>Terms</Label>

                            <select
                                className="selectpicker form-control"
                                data-width="auto"
                                id={`${bemBlockName}--terms_select`}
                                name="terms_select"
                                onChange={onInvoiceTermsSelectionChanged}
                                value={invoiceTermsId ?? ''}
                            >
                                <option value="">Select Terms</option>

                                {invoiceTermsOptions.map((ito) => ((
                                    <option
                                        key={`terms-${ito.id}`}
                                        value={ito.id ?? ''}
                                    >
                                        {ito.name}
                                    </option>
                                )))}
                            </select>
                        </Col>

                        <Col
                            md={2}
                            sm={6}
                        >
                            <Label for={`${bemBlockName}--issue_date_input`}>Issue Date</Label>

                            <Input
                                id={`${bemBlockName}--issue_date_input`}
                                name="issue_date_input"
                                onChange={onInvoiceIssueDateChanged}
                                type="date"
                                value={issueDate}
                            />
                        </Col>

                        <Col
                            md={2}
                            sm={6}
                        >
                            <Label for={`${bemBlockName}--due_date_input`}>Date Date</Label>

                            <Input
                                id={`${bemBlockName}--due_date_input`}
                                name="due_date_input"
                                onChange={onInvoiceDueDateChanged}
                                type="date"
                                value={dueDate}
                            />
                        </Col>
                    </Row>

                    <Row
                        className={`${bemBlockName}--line_items_table_container`}
                        form
                    >
                        <Col sm={12}>
                            <InvoiceLineItemsTable lineItems={dirtyInvoice?.lineItems ?? []} />
                        </Col>
                    </Row>

                    <Row
                        className={`${bemBlockName}--bottom_row`}
                        form
                    >
                        <Col sm={6}>
                            <Label for={`${bemBlockName}--customer_address_textarea`}>Message on Invoice</Label>
                            <Input
                                id={`${bemBlockName}--invoice_message_textarea`}
                                name="invoice_message_textarea"
                                onChange={onInvoiceMessageChanged}
                                placeholder="This will show up on the invoice"
                                type="textarea"
                                value={message}
                            />
                        </Col>
                    </Row>
                </Form>

                <SelectTimeActivitiesForInvoicingModalDialog
                    isOpen={isSelectTimeActivitiesModalOpen}
                    onClose={onCloseAddUnbilledTimeModal}
                />
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(AddInvoicePage);
