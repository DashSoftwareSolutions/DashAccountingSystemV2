import * as React from 'react';
import {
    filter,
    isEmpty,
    isFinite,
    map,
} from 'lodash';
import { ConnectedProps, connect } from 'react-redux';
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
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import Account from '../models/Account';
import AccountSelectOption from '../models/AccountSelectOption';
import KnownAccountType from '../models/KnownAccountType';
import KnownAccountSubType from '../models/KnownAccountSubType';
import * as AccountsStore from '../store/Accounts';
import * as LookupValuesStore from '../store/LookupValues';
import * as PaymentStore from '../store/Payment';

interface ReceivePaymentModalDialogOwnProps {
    isOpen: boolean;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        accounts: state.accounts?.accounts ?? [],
        dirtyPayment: state.payment?.dirtyPayment ?? null,
        isSaving: state.payment?.isSaving ?? false,
        paymentMethods: state.lookups?.paymentMethods ?? [],
    };
};

const mapDispatchToProps = {
    ...PaymentStore.actionCreators,
    requestAccounts: AccountsStore.actionCreators.requestAccounts,
    requestLookupValues: LookupValuesStore.actionCreators.requestLookupValues,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReceivePaymentModalDialogReduxProps = ConnectedProps<typeof connector>;

type ReceivePaymentModalDialogProps = ReceivePaymentModalDialogOwnProps &
    ReceivePaymentModalDialogReduxProps;

interface ReceivePaymentModalDialogState {
    depositAccountOptions: AccountSelectOption[];
    revenueAccountOptions: AccountSelectOption[];
}

class ReceivePaymentModalDialog extends React.PureComponent<ReceivePaymentModalDialogProps, ReceivePaymentModalDialogState> {
    private logger: ILogger;
    private bemBlockName: string = 'receive_payment_modal';

    private static getAccountSelectOptionsState(allAccounts: Account[]): ReceivePaymentModalDialogState {
        if (isEmpty(allAccounts)) {
            return {
                depositAccountOptions: [],
                revenueAccountOptions: [],
            };
        }

        return {
            depositAccountOptions: map(
                filter(allAccounts, (a: Account) => a.accountType.id === KnownAccountType.Asset && a.accountSubType.id === KnownAccountSubType.BankAccount),
                (a: Account) => ({
                    id: a.id,
                    name: `${a.accountNumber} - ${a.name}`,
                })
            ),
            revenueAccountOptions: map(
                filter(allAccounts, (a: Account) => a.accountType.id === KnownAccountType.Revenue),
                (a: Account) => ({
                    id: a.id,
                    name: `${a.accountNumber} - ${a.name}`,
                })
            ),
        };
    }

    public constructor(props: ReceivePaymentModalDialogProps) {
        super(props);

        this.logger = new Logger('Receive Payment Modal');

        this.state = ReceivePaymentModalDialog.getAccountSelectOptionsState(props.accounts);

        this.ensureDataFetched = this.ensureDataFetched.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
        this.onPaymentAmountChanged = this.onPaymentAmountChanged.bind(this);
        this.onPaymentCheckNumberChanged = this.onPaymentCheckNumberChanged.bind(this);
        this.onPaymentDateChanged = this.onPaymentDateChanged.bind(this);
        this.onPaymentDepositAccountSelectionChanged = this.onPaymentDepositAccountSelectionChanged.bind(this);
        this.onPaymentDescriptionChanged = this.onPaymentDescriptionChanged.bind(this);
        this.onPaymentIsPostedNoClicked = this.onPaymentIsPostedNoClicked.bind(this);
        this.onPaymentIsPostedYesClicked = this.onPaymentIsPostedYesClicked.bind(this);
        this.onPaymentMethodSelectionChanged = this.onPaymentMethodSelectionChanged.bind(this);
        this.onPaymentRevenueAccountSelectionChanged = this.onPaymentRevenueAccountSelectionChanged.bind(this);
    }

    public componentDidUpdate(prevProps: ReceivePaymentModalDialogProps) {
        const {
            accounts,
            isOpen,
            isSaving,
        } = this.props;

        const {
            isOpen: wasOpen,
            isSaving: wasSaving,
        } = prevProps;

        if (isOpen && !wasOpen) {
            this.ensureDataFetched();
            return;
        }

        if (wasSaving && !isSaving) {
            this.logger.info('Finished saving!');
            return;
        }

        const {
            depositAccountOptions,
            revenueAccountOptions,
        } = this.state;

        const hasDepositAccountOptions = !isEmpty(depositAccountOptions);
        const hasRevenueAccountOptions = !isEmpty(revenueAccountOptions);

        if (!isEmpty(accounts) && (!hasDepositAccountOptions || !hasRevenueAccountOptions)) {
            this.setState(ReceivePaymentModalDialog.getAccountSelectOptionsState(accounts));
        }
    }

    public render() {
        const {
            dirtyPayment,
            isOpen,
            isSaving,
            onClose,
            paymentMethods,
        } = this.props;

        const {
            depositAccountOptions,
            revenueAccountOptions,
        } = this.state;

        const paymentAmount = dirtyPayment?.amount?.amountAsString ?? '';
        const paymentCheckNumber = dirtyPayment?.checkNumber?.toString() ?? '';
        const paymentCustomer = dirtyPayment?.customer?.displayName ?? '';
        const paymentDate = dirtyPayment?.paymentDate ?? '';
        const paymentDepositAccountId = dirtyPayment?.depositAccountId ?? '';
        const paymentDescription = dirtyPayment?.description ?? '';
        const paymentIsPosted = dirtyPayment?.isPosted ?? false;
        const paymentMethodId = dirtyPayment?.paymentMethodId?.toString() ?? '';
        const paymentRevenueAccountId = dirtyPayment?.revenueAccountId ?? '';

        return (
            <Modal
                centered
                id={this.bemBlockName}
                isOpen={isOpen}
                size="lg"
                toggle={onClose}
            >
                <ModalHeader tag="div" className={`${this.bemBlockName}--modal_header`}>
                    <Row>
                        <Col md={4}>
                            <h5>Receive Payment</h5>
                        </Col>
                        <Col md={8} className="text-right">
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
                                disabled={isSaving} // TODO: Disable if cannot save due to validation
                                id={`${this.bemBlockName}--save_button`}
                                onClick={this.onClickSave}
                                style={{ width: 88 }}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col sm={4}>
                                <Label for={`${this.bemBlockName}--customer_input`}>Customer</Label>
                                <Input
                                    id={`${this.bemBlockName}--customer_input`}
                                    readOnly
                                    style={{ border: 'none', width: '100%' }}
                                    type="text"
                                    value={paymentCustomer}
                                />
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--payment_date_input`}>Payment Date</Label>
                                    <Input
                                        id={`${this.bemBlockName}--payment_date_input`}
                                        name="payment_date_input"
                                        onChange={this.onPaymentDateChanged}
                                        type="date"
                                        value={paymentDate}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <Label for={`${this.bemBlockName}--payment_amount`}>Amount Received</Label>
                                <Input
                                    id={`${this.bemBlockName}--payment_amount`}
                                    onChange={this.onPaymentAmountChanged}
                                    step="any"
                                    style={{ textAlign: 'right' }}
                                    type="number"
                                    value={paymentAmount}
                                />
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--payment_method_select`}>Payment Method</Label>
                                    <select
                                        className="selectpicker form-control"
                                        data-width="auto"
                                        id={`${this.bemBlockName}--payment_method_select`}
                                        name="payment_method_select"
                                        onChange={this.onPaymentMethodSelectionChanged}
                                        placeholder="Select Payment Method"
                                        value={paymentMethodId}
                                    >
                                        <option value="">Select</option>
                                        {map(paymentMethods, (paymentMethod) => ((
                                            <option key={paymentMethod.id} value={paymentMethod.id.toString()}>
                                                {paymentMethod.name}
                                            </option>
                                        )))}
                                    </select>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <Label for={`${this.bemBlockName}--check_number_input`}>Check Number</Label>
                                <Input
                                    id={`${this.bemBlockName}--check_number_input`}
                                    name="check_number_input"
                                    onChange={this.onPaymentCheckNumberChanged}
                                    placeholder="check # (if applicable)"
                                    type="number"
                                    value={paymentCheckNumber}
                                />
                            </Col>
                            
                            <Col sm={4}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--is_posted_button_group`}>
                                        Is Payment Posted?
                                    </Label>
                                    <div className={`${this.bemBlockName}--is_posted_button_group_wrapper`}>
                                        <ButtonGroup id={`${this.bemBlockName}--is_posted_button_group`}>
                                            <Button
                                                className={!paymentIsPosted ? 'active' : undefined}
                                                color="primary"
                                                id={`${this.bemBlockName}--is_posted_no_button`}
                                                onClick={this.onPaymentIsPostedNoClicked}
                                                outline
                                            >
                                                No
                                            </Button>
                                            <Button
                                                className={paymentIsPosted ? 'active' : undefined}
                                                color="primary"
                                                id={`${this.bemBlockName}--is_posted_yes_button`}
                                                onClick={this.onPaymentIsPostedYesClicked}
                                                outline
                                            >
                                                Yes
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--deposit_account_select`}>Deposit Account</Label>
                                    <select
                                        className="selectpicker form-control"
                                        data-width="auto"
                                        id={`${this.bemBlockName}--deposit_account_select`}
                                        name="deposit_account_select"
                                        onChange={this.onPaymentDepositAccountSelectionChanged}
                                        placeholder="Select Deposit Account"
                                        value={paymentDepositAccountId}
                                    >
                                        <option value="">Select</option>
                                        {map(depositAccountOptions, (a) => ((
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        )))}
                                    </select>
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--revenue_account_select`}>Revenue Account</Label>
                                    <select
                                        className="selectpicker form-control"
                                        data-width="auto"
                                        id={`${this.bemBlockName}--revenue_account_select`}
                                        name="revenue_account_select"
                                        onChange={this.onPaymentRevenueAccountSelectionChanged}
                                        placeholder="Select Revenue Account"
                                        value={paymentRevenueAccountId}
                                    >
                                        <option value="">Select</option>
                                        {map(revenueAccountOptions, (a) => ((
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        )))}
                                    </select>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={12}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--description_textarea`}>Description</Label>
                                    <Input
                                        id={`${this.bemBlockName}--description_textarea`}
                                        name="description_textarea"
                                        onChange={this.onPaymentDescriptionChanged}
                                        type="textarea"
                                        value={paymentDescription}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {'\u00A0'}
                </ModalFooter>
            </Modal>
        );
    }

    private ensureDataFetched() {
        const {
            requestAccounts,
            requestLookupValues,
        } = this.props;

        requestAccounts();
        requestLookupValues();
    }

    private onClickCancel(event: React.MouseEvent<any>) {
        const {
            reset,
            onClose,
        } = this.props;

        reset();
        onClose(event);
    }

    private onClickSave(event: React.MouseEvent<any>) {
        this.logger.info('Saving the payment ...');
    }

    private onPaymentAmountChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const amountAsString = event.currentTarget.value;
        const parsedAmount = parseFloat(amountAsString);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        const { updatePaymentAmount } = this.props;
        updatePaymentAmount(amountAsString, safeValueForUpdate);
    }

    private onPaymentCheckNumberChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updatePaymentCheckNumber } = this.props;

        const parsedCheckNumber = parseInt(event.currentTarget.value, 10);

        const safeValueForUpdate = isFinite(parsedCheckNumber) ?
            parsedCheckNumber :
            null;

        updatePaymentCheckNumber(safeValueForUpdate);
    }

    private onPaymentDateChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updatePaymentDate } = this.props;
        updatePaymentDate(event.currentTarget.value ?? null);
    }

    private onPaymentDescriptionChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updatePaymentDescription } = this.props;
        updatePaymentDescription(event.currentTarget.value ?? null);
    }

    private onPaymentDepositAccountSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updatePaymentDepositAccount } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updatePaymentDepositAccount(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updatePaymentDepositAccount(selectedOption.value);
    }

    private onPaymentIsPostedNoClicked(_: React.MouseEvent<any>) {
        const { updatePaymentIsPosted } = this.props;
        updatePaymentIsPosted(false);
    }

    private onPaymentIsPostedYesClicked(_: React.MouseEvent<any>) {
        const { updatePaymentIsPosted } = this.props;
        updatePaymentIsPosted(true);
    }

    private onPaymentMethodSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updatePaymentMethod } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updatePaymentMethod(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updatePaymentMethod(parseInt(selectedOption.value, 10));
    }

    private onPaymentRevenueAccountSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updatePaymentRevenueAccount } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updatePaymentRevenueAccount(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updatePaymentRevenueAccount(selectedOption.value);
    }
}

export default connector(ReceivePaymentModalDialog);