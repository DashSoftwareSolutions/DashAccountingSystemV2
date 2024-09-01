import React, {
    useCallback,
    useEffect,
} from 'react';
import ClassNames from 'classnames';
import {
    isEmpty,
    isFinite,
    isNil,
} from 'lodash';
import { DateTime } from 'luxon';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
} from 'reactstrap';
import { InvoicePayment } from './models';
import { actionCreators as paymentActionCreators } from './redux';
import { RootState } from '../../../app/globalReduxStore';
import { actionCreators as lookupValueActionCreators } from '../../../app/lookupValues';
import AmountDisplay from '../../../common/components/amountDisplay';
import {
    DEFAULT_AMOUNT,
    DEFAULT_ASSET_TYPE,
} from '../../../common/constants';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import {
    Amount,
    AmountType,
} from '../../../common/models';
import useNamedState from '../../../common/utilities/useNamedState';
import usePrevious from '../../../common/utilities/usePrevious';
import {
    Account,
    AccountSelectOption,
    KnownAccountSubType,
    KnownAccountType,
} from '../../accounting/chart-of-accounts/models';
import { actionCreators as accountingActionCreators } from '../../accounting/chart-of-accounts/redux';

interface ReceivePaymentModalDialogOwnProps {
    isOpen: boolean;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: RootState) => {
    return {
        accounts: state.chartOfAccounts?.accounts ?? [],
        assetType: state.application?.selectedTenant?.defaultAssetType ?? DEFAULT_ASSET_TYPE,
        canSave: state.payments?.canSave ?? false,
        dirtyPayment: state.payments?.dirtyPayment ?? null,
        isSaving: state.payments?.isSaving ?? false,
        paymentMethods: state.lookups?.paymentMethods ?? [],
    };
};

const mapDispatchToProps = {
    ...paymentActionCreators,
    requestAccounts: accountingActionCreators.requestAccounts,
    requestLookupValues: lookupValueActionCreators.requestLookupValues,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReceivePaymentModalDialogReduxProps = ConnectedProps<typeof connector>;

type PropTypes = ReceivePaymentModalDialogOwnProps & ReceivePaymentModalDialogReduxProps;

const logger: ILogger = new Logger('Receive Payment Modal Dialog');

const bemBlockName: string = 'receive_payment_modal';

function ReceivePaymentModalDialog(props: PropTypes) {
    const {
        accounts,
        assetType,
        canSave,
        dirtyPayment,
        isSaving,
        isOpen,
        onClose,
        paymentMethods,
        requestAccounts,
        requestLookupValues,
        reset,
        saveNewPayment,
        updatePaymentAmount,
        updatePaymentCheckNumber,
        updatePaymentDate,
        updatePaymentDepositAccount,
        updatePaymentDescription,
        updatePaymentInvoiceAmount,
        updatePaymentInvoiceIsSelected,
        updatePaymentIsPosted,
        updatePaymentMethod,
        updatePaymentRevenueAccount,
        updatePaymentSelectAllInvoices,
    } = props;

    const wasOpen = usePrevious(isOpen);
    const [depositAccountOptions, setDepositAccountOptions] = useNamedState<AccountSelectOption[]>('depositAccountOptions', []);
    const [revenueAccountOptions, setRevenueAccountOptions] = useNamedState<AccountSelectOption[]>('revenueAccountOptions', []);

    // Ensure data is fetched when the Modal Dialog is opened
    useEffect(() => {
        if (isOpen && !wasOpen) {
            requestAccounts();
            requestLookupValues();
        }
    }, [
        isOpen,
        requestAccounts,
        requestLookupValues,
        wasOpen,
    ]);

    // If the accounts have been fetched, set up the Deposit and Revenue Account Options in state
    useEffect(() => {
        if (!isEmpty(accounts)) {
            if (isEmpty(depositAccountOptions)) {
                const depAcctOpts: AccountSelectOption[] = accounts
                    .filter((a: Account) => a.accountType.id === KnownAccountType.Asset && a.accountSubType.id === KnownAccountSubType.BankAccount)
                    .map((a: Account): AccountSelectOption => ({
                        id: a.id,
                        name: `${a.accountNumber} - ${a.name}`,
                    }));

                setDepositAccountOptions(depAcctOpts);
            }

            if (isEmpty(revenueAccountOptions)) {
                const revAcctOpts: AccountSelectOption[] = accounts
                    .filter((a: Account) => a.accountType.id === KnownAccountType.Revenue)
                    .map((a: Account): AccountSelectOption => ({
                        id: a.id,
                        name: `${a.accountNumber} - ${a.name}`,
                    }));

                setRevenueAccountOptions(revAcctOpts);
            }
        }
    }, [
        accounts,
        depositAccountOptions,
        revenueAccountOptions,
        setDepositAccountOptions,
        setRevenueAccountOptions,
    ]);

    const onClickCancel = (event: React.MouseEvent<any>) => {
        reset();
        onClose(event);
    };

    const onClickSave = (event: React.MouseEvent<any>) => {
        saveNewPayment();
        onClose(event); // TODO/FIXME: Do we want to close the modal on error?  Right now we have to in order to see the error message.  Need to rethink error handling???
    };

    const onInvoicePaymentAmountChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>, invoiceId: string) => {
        const amountAsString = event.currentTarget.value;
        const parsedAmount = parseFloat(amountAsString);
        updatePaymentInvoiceAmount(invoiceId, amountAsString, isFinite(parsedAmount) ? parsedAmount : null);
    },[updatePaymentInvoiceAmount]);

    const onPaymentAmountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amountAsString = event.currentTarget.value;
        const parsedAmount = parseFloat(amountAsString);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        updatePaymentAmount(amountAsString, safeValueForUpdate);
    };

    const onPaymentCheckNumberChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const parsedCheckNumber = parseInt(event.currentTarget.value, 10);

        const safeValueForUpdate = isFinite(parsedCheckNumber) ?
            parsedCheckNumber :
            null;

        updatePaymentCheckNumber(safeValueForUpdate);
    };

    const onPaymentDateChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updatePaymentDate(event.currentTarget.value ?? null);
    };

    const onPaymentDescriptionChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updatePaymentDescription(event.currentTarget.value ?? null);
    };

    const onPaymentDepositAccountSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updatePaymentDepositAccount(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updatePaymentDepositAccount(selectedOption.value);
    };

    const onPaymentIsPostedNoClicked = (_: React.MouseEvent<any>) => {
        updatePaymentIsPosted(false);
    };

    const onPaymentIsPostedYesClicked = (_: React.MouseEvent<any>) => {
        updatePaymentIsPosted(true);
    };

    const onPaymentMethodSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updatePaymentMethod(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updatePaymentMethod(parseInt(selectedOption.value, 10));
    };

    const onPaymentRevenueAccountSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updatePaymentRevenueAccount(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updatePaymentRevenueAccount(selectedOption.value);
    };

    const onSelectAllCheckChanged = useCallback((_: React.FormEvent<HTMLInputElement>) => {
        const areAllInvoicesCurrentlySelected = (dirtyPayment?.invoices ?? []).every((i: InvoicePayment) => i.isSelected ?? false);
        updatePaymentSelectAllInvoices(!areAllInvoicesCurrentlySelected);
    }, [
        dirtyPayment,
        updatePaymentSelectAllInvoices,
    ]);

    const onSelectInvoiceCheckChanged = useCallback((_: React.FormEvent<HTMLInputElement>, invoicePayment: InvoicePayment) => {
        updatePaymentInvoiceIsSelected(invoicePayment.invoiceId, !(invoicePayment.isSelected ?? false));
    }, [updatePaymentInvoiceIsSelected]);

    const renderInvoicesTable = useCallback((): JSX.Element => {
        if (isNil(dirtyPayment))
            return (<React.Fragment />);

        if (isEmpty(dirtyPayment.invoices)) {
            return (
                <p>
                    No Invoices are selected
                </p>
            );
        }

        const areAllInvoicesSelected = dirtyPayment.invoices.every((i: InvoicePayment) => i.isSelected ?? false);

        const tableClasses = ClassNames(
            'table',
            'table-hover',
            'table-sm',
            'report-table',
            `${bemBlockName}--time_activities_table`,
        );

        return (
            <table className={tableClasses}>
                <thead>
                    <tr>
                        <th className="col-md-1 bg-white sticky-top sticky-border">
                            <FormGroup
                                check
                                inline
                            >
                                <Input
                                    checked={areAllInvoicesSelected}
                                    id={`${bemBlockName}--select_all_checkbox`}
                                    onChange={onSelectAllCheckChanged}
                                    type="checkbox"
                                />
                            </FormGroup>
                        </th>
                        <th className="col-md-3 bg-white sticky-top sticky-border">Invoice</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border">Due Date</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Original Amount</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Open Balance</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Payment</th>
                    </tr>
                </thead>

                <tbody>
                    {dirtyPayment.invoices.map((invoicePayment: InvoicePayment) => (
                        <tr
                            className={`${bemBlockName}--invoices_table_row`}
                            key={invoicePayment.invoiceId}
                        >
                            <td>
                                <FormGroup
                                    check
                                    inline
                                >
                                    <Input
                                        checked={invoicePayment.isSelected ?? false}
                                        id={`${bemBlockName}--select_invoice_checkbox_${invoicePayment.invoice?.invoiceNumber ?? invoicePayment.invoiceId}`}
                                        onChange={(e) => onSelectInvoiceCheckChanged(e, invoicePayment)}
                                        type="checkbox"
                                    />
                                </FormGroup>
                            </td>
                            <td>
                                {`Invoice # ${invoicePayment.invoice?.invoiceNumber} (${DateTime.fromISO(invoicePayment.invoice?.issueDate ?? '').toFormat('MM/dd/yyyy')})`}
                            </td>
                            <td>
                                {DateTime.fromISO(invoicePayment.invoice?.dueDate ?? '').toFormat('MM/dd/yyyy')}
                            </td>
                            <td className="text-end">
                                <AmountDisplay
                                    amount={invoicePayment.invoice?.amount ?? DEFAULT_AMOUNT}
                                    showCurrency
                                />
                            </td>
                            <td className="text-end">
                                {/* TODO: This should be the invoice total minus any previous partial payments */}
                                <AmountDisplay
                                    amount={invoicePayment.invoice?.amount ?? DEFAULT_AMOUNT}
                                    showCurrency
                                />
                            </td>
                            <td
                                className="text-end"
                                style={{ paddingRight: 0 }}
                            >
                                <Input
                                    id={`${bemBlockName}--edit_invoice_payment_amount_input_${invoicePayment.invoice?.invoiceNumber ?? invoicePayment.invoiceId}`}
                                    onChange={(e) => onInvoicePaymentAmountChanged(e, invoicePayment.invoiceId)}
                                    step="any"
                                    style={{ textAlign: 'right' }}
                                    type="number"
                                    value={invoicePayment.paymentAmount.amountAsString ?? ''}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }, [
        dirtyPayment,
        onInvoicePaymentAmountChanged,
        onSelectAllCheckChanged,
        onSelectInvoiceCheckChanged,
    ]);

    const paymentAmount = dirtyPayment?.amount?.amountAsString ?? '';
    const paymentCheckNumber = dirtyPayment?.checkNumber?.toString() ?? '';
    const paymentCustomer = dirtyPayment?.customer?.displayName ?? '';
    const paymentDate = dirtyPayment?.paymentDate ?? '';
    const paymentDepositAccountId = dirtyPayment?.depositAccountId ?? '';
    const paymentDescription = dirtyPayment?.description ?? '';
    const paymentIsPosted = dirtyPayment?.isPosted ?? false;
    const paymentMethodId = dirtyPayment?.paymentMethodId?.toString() ?? '';
    const paymentRevenueAccountId = dirtyPayment?.revenueAccountId ?? '';

    const invoicePaymentsTotal = dirtyPayment?.invoices
        .filter((i) => i.isSelected ?? false)
        .map((i) => i.paymentAmount.amount ?? 0)
        .reduce((prev, current) => prev += current, 0) ?? 0;

    const invoicePaymentsTotalAmount: Amount = {
        amount: invoicePaymentsTotal,
        amountType: AmountType.Debit,
        assetType,
    };

    return (
        <Modal
            backdrop="static"
            centered
            id={bemBlockName}
            isOpen={isOpen}
            size="lg"
            toggle={onClose}
        >
            <ModalHeader
                className={`${bemBlockName}--modal_header`}
                tag="div"
            >
                <Row>
                    <Col md={4}>
                        <h5>Receive Payment</h5>
                    </Col>

                    <Col
                        className="text-end"
                        md={8}
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
                            disabled={!canSave || isSaving}
                            id={`${bemBlockName}--save_button`}
                            onClick={onClickSave}
                            style={{ width: 88 }}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </Col>
                </Row>
            </ModalHeader>

            <ModalBody>
                <Form>
                    <Row>
                        <Col sm={4}>
                            <Label for={`${bemBlockName}--customer_input`}>Customer</Label>

                            <Input
                                id={`${bemBlockName}--customer_input`}
                                readOnly
                                style={{
                                    border: 'none',
                                    width: '100%',
                                }}
                                type="text"
                                value={paymentCustomer}
                            />
                        </Col>

                        <Col sm={4}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--payment_date_input`}>Payment Date</Label>

                                <Input
                                    id={`${bemBlockName}--payment_date_input`}
                                    name="payment_date_input"
                                    onChange={onPaymentDateChanged}
                                    type="date"
                                    value={paymentDate}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={4}>
                            <Label for={`${bemBlockName}--payment_amount`}>Amount Received</Label>

                            <Input
                                id={`${bemBlockName}--payment_amount`}
                                onChange={onPaymentAmountChanged}
                                step="any"
                                style={{ textAlign: 'right' }}
                                type="number"
                                value={paymentAmount}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={4}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--payment_method_select`}>Payment Method</Label>

                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${bemBlockName}--payment_method_select`}
                                    name="payment_method_select"
                                    onChange={onPaymentMethodSelectionChanged}
                                    value={paymentMethodId}
                                >
                                    <option value="">Select Payment Method</option>

                                    {paymentMethods.map((paymentMethod) => ((
                                        <option
                                            key={paymentMethod.id}
                                            value={paymentMethod.id.toString()}
                                        >
                                            {paymentMethod.name}
                                        </option>
                                    )))}
                                </select>
                            </FormGroup>
                        </Col>

                        <Col sm={4}>
                            <Label for={`${bemBlockName}--check_number_input`}>Check Number</Label>

                            <Input
                                id={`${bemBlockName}--check_number_input`}
                                name="check_number_input"
                                onChange={onPaymentCheckNumberChanged}
                                placeholder="check # (if applicable)"
                                type="number"
                                value={paymentCheckNumber}
                            />
                        </Col>

                        <Col sm={4}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--is_posted_button_group`}>
                                    Is Payment Posted?
                                </Label>

                                <div className={`${bemBlockName}--is_posted_button_group_wrapper`}>
                                    <ButtonGroup id={`${bemBlockName}--is_posted_button_group`}>
                                        <Button
                                            className={!paymentIsPosted ? 'active' : undefined}
                                            color="primary"
                                            id={`${bemBlockName}--is_posted_no_button`}
                                            onClick={onPaymentIsPostedNoClicked}
                                            outline
                                        >
                                            No
                                        </Button>

                                        <Button
                                            className={paymentIsPosted ? 'active' : undefined}
                                            color="primary"
                                            id={`${bemBlockName}--is_posted_yes_button`}
                                            onClick={onPaymentIsPostedYesClicked}
                                            outline
                                        >
                                            Yes
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--deposit_account_select`}>Deposit Account</Label>

                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${bemBlockName}--deposit_account_select`}
                                    name="deposit_account_select"
                                    onChange={onPaymentDepositAccountSelectionChanged}
                                    value={paymentDepositAccountId}
                                >
                                    <option value="">Select Deposit Account</option>

                                    {depositAccountOptions.map((a) => ((
                                        <option
                                            key={a.id}
                                            value={a.id}
                                        >
                                            {a.name}
                                        </option>
                                    )))}
                                </select>
                            </FormGroup>
                        </Col>

                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--revenue_account_select`}>Revenue Account</Label>

                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${bemBlockName}--revenue_account_select`}
                                    name="revenue_account_select"
                                    onChange={onPaymentRevenueAccountSelectionChanged}
                                    value={paymentRevenueAccountId}
                                >
                                    <option value="">Select Revenue Account</option>

                                    {revenueAccountOptions.map((a) => ((
                                        <option
                                            key={a.id}
                                            value={a.id}
                                        >
                                            {a.name}
                                        </option>
                                    )))}
                                </select>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--description_textarea`}>Description</Label>

                                <Input
                                    id={`${bemBlockName}--description_textarea`}
                                    name="description_textarea"
                                    onChange={onPaymentDescriptionChanged}
                                    type="textarea"
                                    value={paymentDescription}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <h6>Outstanding Invoices</h6>
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            className={`${bemBlockName}--invoices_table_container`}
                            sm={12}
                        >
                            {renderInvoicesTable()}
                        </Col>
                    </Row>
                </Form>
            </ModalBody>

            <ModalFooter>
                <div style={{ fontWeight: 'bold' }}>
                    Total:
                    {'\u00A0'}
                    <AmountDisplay
                        amount={invoicePaymentsTotalAmount}
                        showCurrency
                    />
                </div>
            </ModalFooter>
        </Modal>
    );
}

export default connector(ReceivePaymentModalDialog);
