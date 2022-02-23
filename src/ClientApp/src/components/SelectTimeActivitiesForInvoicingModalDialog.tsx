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
import {
    isEmpty,
    isNil,
    some,
} from 'lodash';
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import * as InvoiceStore from '../store/Invoice';
import TimeActivity from '../models/TimeActivity';

interface SelectTimeActivitiesForInvoicingModalDialogOwnProps {
    isOpen: boolean;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        startDate: state?.invoice?.details.unbilledTimeActivitiesFilterStartDate ?? null,
        endDate: state?.invoice?.details.unbilledTimeActivitiesFilterEndDate ?? null,
        isLoading: state?.invoice?.details.isLoadingUnbilledTimeActivities ?? false,
        timeActivities: state?.invoice?.details.unbilledTimeActivities ?? [],
    };
}

const mapDispatchToProps = {
    ...InvoiceStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type SelectTimeActivitiesForInvoicingModalDialogReduxProps = ConnectedProps<typeof connector>;

type SelectTimeActivitiesForInvoicingModalDialogProps = SelectTimeActivitiesForInvoicingModalDialogOwnProps &
    SelectTimeActivitiesForInvoicingModalDialogReduxProps;

interface SelectTimeActivitiesForInvoicingModalDialogState {
    hasCheckedForTimeActivities: boolean;
    isSelectAllChecked: boolean;
    selectedTimeActivityIds: string[];
}

class SelectTimeActivitiesForInvoicingModalDialog extends React.PureComponent<SelectTimeActivitiesForInvoicingModalDialogProps, SelectTimeActivitiesForInvoicingModalDialogState> {
    private logger: ILogger;
    private bemBlockName: string = 'select_time_activities_for_invoicing_modal';

    public constructor(props: SelectTimeActivitiesForInvoicingModalDialogProps) {
        super(props);

        this.logger = new Logger('Select Time Activities For Invoicing Modal');

        this.state = {
            hasCheckedForTimeActivities: false,
            isSelectAllChecked: false,
            selectedTimeActivityIds: [],
        };

        this.onClickAddSelectedItemsToInvoice = this.onClickAddSelectedItemsToInvoice.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickCheckForUnbilledTimeActivities = this.onClickCheckForUnbilledTimeActivities.bind(this);
        this.onEndDateChanged = this.onEndDateChanged.bind(this);
        this.onStartDateChanged = this.onStartDateChanged.bind(this);
    }

    public render() {
        const {
            endDate,
            isLoading,
            isOpen,
            onClose,
            startDate,
            timeActivities,
        } = this.props;

        const {
            hasCheckedForTimeActivities,
            isSelectAllChecked,
            selectedTimeActivityIds,
        } = this.state;

        const areAnyTimeActivitiesSelected = !isEmpty(selectedTimeActivityIds);

        const hasValidDateRange = !isNil(startDate) &&
            !isNil(endDate) &&
            (moment(endDate).isSameOrAfter(moment(startDate), 'day'));

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
                                style={{ marginRight: 22, width: 132 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                disabled={!areAnyTimeActivitiesSelected}
                                id={`${this.bemBlockName}--add_selected_button`}
                                onClick={this.onClickAddSelectedItemsToInvoice}
                                style={{ width: 132 }}
                            >
                                Add Selected
                            </Button>
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col md={3}>
                                <Label for={`${this.bemBlockName}--date_range_start_input`}>Date Range Start</Label>
                                <Input
                                    id={`${this.bemBlockName}--date_range_start_input`}
                                    name="date_range_start_input"
                                    onChange={this.onStartDateChanged}
                                    type="date"
                                    value={startDate ?? ''}
                                />
                            </Col>
                            <Col md={3}>
                                <Label for={`${this.bemBlockName}--date_range_end_input`}>Date Range End</Label>
                                <Input
                                    id={`${this.bemBlockName}--date_range_end_input`}
                                    name="date_range_end_input"
                                    onChange={this.onEndDateChanged}
                                    type="date"
                                    value={endDate ?? ''}
                                />
                            </Col>
                            <Col md={6} className="text-right">
                                <Button
                                    color="success"
                                    disabled={!hasValidDateRange}
                                    id={`${this.bemBlockName}--check_for_unbilled_time_button`}
                                    onClick={this.onClickCheckForUnbilledTimeActivities}
                                    style={{ width: 220, marginTop: 32 }}
                                >
                                    Check for Unbilled Time
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} className={`${this.bemBlockName}--main_content_container`}>
                                {isLoading ? (
                                    <p>Loading...</p>
                                ) : !isEmpty(timeActivities) ? (
                                        <p>TODO: Render the Time Activities!</p>
                                    ) : hasCheckedForTimeActivities ? (
                                            <p>No Unbilled Time Activities found for this Customer and the selected date range.</p>
                                        ) : null}
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {isEmpty(timeActivities) ? '\u00A0' : `${selectedTimeActivityIds.length} ${selectedTimeActivityIds.length === 1 ? 'Time Activity' : 'Time Activities'} selected for invoicing`}
                </ModalFooter>
            </Modal>
        );
    }

    private onClickAddSelectedItemsToInvoice(event: React.MouseEvent<any>) {
        this.logger.info('Adding selected items to the invoice ...');

        // TODO: Dispatch action to add the selected Time Activties to the Invoice

        // Reset component state
        this.setState({
            hasCheckedForTimeActivities: false,
            isSelectAllChecked: false,
            selectedTimeActivityIds: [],
        });

        const { onClose } = this.props;
        onClose(event);
    }

    private onClickCancel(event: React.MouseEvent<any>) {
        // TODO: Dispatch any and all needed Redux reset actions

        // Reset component state
        this.setState({
            hasCheckedForTimeActivities: false,
            isSelectAllChecked: false,
            selectedTimeActivityIds: [],
        });

        // Close the modal
        const { onClose } = this.props;
        onClose(event);
    }

    private onClickCheckForUnbilledTimeActivities(event: React.MouseEvent<any>) {
        const { requestUnbilledTimeActivities } = this.props;
        requestUnbilledTimeActivities();

        this.setState({ hasCheckedForTimeActivities: true });
    }

    private onEndDateChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateUnbilledTimeActivitiesFilterEndDate } = this.props;
        updateUnbilledTimeActivitiesFilterEndDate(event.currentTarget.value ?? null);
    }

    private onStartDateChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateUnbilledTimeActivitiesFilterStartDate } = this.props;
        updateUnbilledTimeActivitiesFilterStartDate(event.currentTarget.value ?? null);
    }
}

export default connector(SelectTimeActivitiesForInvoicingModalDialog);