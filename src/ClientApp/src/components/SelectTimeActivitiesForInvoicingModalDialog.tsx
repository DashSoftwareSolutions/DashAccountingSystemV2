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
import * as moment from 'moment-timezone';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import * as InvoiceStore from '../store/Invoice';

interface SelectTimeActivitiesForInvoicingModalDialogOwnProps {
    isOpen: boolean;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: ApplicationState) => {
    return {};
}

const mapDispatchToProps = {
    ...InvoiceStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type SelectTimeActivitiesForInvoicingModalDialogReduxProps = ConnectedProps<typeof connector>;

type SelectTimeActivitiesForInvoicingModalDialogProps = SelectTimeActivitiesForInvoicingModalDialogOwnProps &
    SelectTimeActivitiesForInvoicingModalDialogReduxProps;

class SelectTimeActivitiesForInvoicingModalDialog extends React.PureComponent< SelectTimeActivitiesForInvoicingModalDialogProps> {
    private logger: ILogger;
    private bemBlockName: string = 'select_time_activities_for_invoicing_modal';

    public constructor(props: SelectTimeActivitiesForInvoicingModalDialogProps) {
        super(props);

        this.logger = new Logger('Select Time Activities For Invoicing Modal');

        this.onClickAddSelectedItemsToInvoice = this.onClickAddSelectedItemsToInvoice.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
    }

    public render() {
        const {
            isOpen,
            onClose,
        } = this.props;

        return (
            <Modal
                centered
                className={this.bemBlockName}
                id={this.bemBlockName}
                isOpen={isOpen}
                size="lg"
                toggle={onClose}
            >
                <ModalHeader tag="div" className={`${this.bemBlockName}--modal_header`}>
                    <Row>
                        <Col md={6}>
                            <h5>Add Unbilled Time Activities to Invoice</h5>
                        </Col>
                        <Col md={6} className="text-right">
                            <Button
                                color="secondary"
                                id={`${this.bemBlockName}--cancel_button`}
                                onClick={this.onClickCancel}
                                style={{ marginRight: 22, width: 121 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                id={`${this.bemBlockName}--add_selected_button`}
                                onClick={this.onClickAddSelectedItemsToInvoice}
                                style={{ width: 121 }}
                            >
                                Add Selected
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

    private onClickAddSelectedItemsToInvoice(event: React.MouseEvent<any>) {
        this.logger.info('Adding selected items to the invoice ...');

        const { onClose } = this.props;
        onClose(event);
    }

    private onClickCancel(event: React.MouseEvent<any>) {
        // TODO: Also dispatch any and all needed Redux reset actions
        const { onClose } = this.props;
        onClose(event);
    }
}

export default connector(SelectTimeActivitiesForInvoicingModalDialog);