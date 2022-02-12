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
import Mode from '../models/Mode';
import * as TimeActivityStore from '../store/TimeActivity';

interface TimeActivityEntryModalDialogOwnProps {
    isOpen: boolean;
    mode: Mode | null;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        customers: state?.customers?.customers ?? [],
        employees: state?.employees?.employees ?? [],
        isDeleting: state.timeActivity?.isDeleting ?? false,
        isSaving: state.timeActivity?.isSaving ?? false,
        products: state.products?.products ?? [],
        timeActivity: state.timeActivity?.dirtyTimeActivity,
        timeZones: state.lookups?.timeZones ?? [],
        // TODO: Validation state
    };
};

const mapDispatchToProps = {
    ...TimeActivityStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TimeActivityEntryModalDialogReduxProps = ConnectedProps<typeof connector>;

type TimeActivityEntryModalDialogProps = TimeActivityEntryModalDialogOwnProps &
    TimeActivityEntryModalDialogReduxProps;

class TimeActivityEntryModalDialog extends React.PureComponent<TimeActivityEntryModalDialogProps> {
    private logger: ILogger;
    private bemBlockName: string = 'time_activity_entry_modal';

    public constructor(props: TimeActivityEntryModalDialogProps) {
        super(props);

        this.logger = new Logger('Time Activity Entry Modal');

        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
        this.onTimeActivityDateChanged = this.onTimeActivityDateChanged.bind(this);
    }

    public render() {
        const {
            isOpen,
            isDeleting,
            isSaving,
            mode,
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
                            <h5>Time Activity</h5>
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
                            {mode === Mode.Edit ? (
                                <Button
                                    color="danger"
                                    disabled={isDeleting} // TODO: Disable if it shouldn't be deleted per business rules (e.g. tied to an Invoice, etc.)
                                    id={`${this.bemBlockName}--delete_button`}
                                    onClick={this.onClickDelete}
                                    style={{ marginRight: 22, width: 88 }}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            ) : null}
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

                    </Form>
                </ModalBody>
            </Modal>
        );
    }

    private onClickCancel(event: React.MouseEvent<any>) {
        // TODO: Also reset dirty time activity/selected time activity state
        const { onClose } = this.props;
        onClose(event);
    }

    private onClickDelete(event: React.MouseEvent<any>) {
        this.logger.debug('Deleting the time activity...');
    }

    private onClickSave(event: React.MouseEvent<any>) {
        this.logger.debug('Saving the time activity...');
    }

    private onTimeActivityDateChanged(e: React.FormEvent<HTMLInputElement>) {
        const { updateDate } = this.props;
        updateDate(e.currentTarget.value ?? null);
    }
}

export default connector(TimeActivityEntryModalDialog);