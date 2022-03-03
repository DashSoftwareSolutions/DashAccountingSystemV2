import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
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
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
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
        accountSelectOptions: state.accounts?.accountSelectOptions ?? [],
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

class ReceivePaymentModalDialog extends React.PureComponent<ReceivePaymentModalDialogProps> {
    private logger: ILogger;
    private bemBlockName: string = 'receive_payment_modal';

    public constructor(props: ReceivePaymentModalDialogProps) {
        super(props);

        this.logger = new Logger('Receive Payment Modal');

        this.ensureDataFetched = this.ensureDataFetched.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
    }

    public componentDidUpdate(prevProps: ReceivePaymentModalDialogProps) {
        const {
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
        }
    }

    public render() {
        const {
            isOpen,
            isSaving,
            onClose,
        } = this.props;

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
                    <p>Hello World!</p>
                </ModalBody>
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
}

export default connector(ReceivePaymentModalDialog);