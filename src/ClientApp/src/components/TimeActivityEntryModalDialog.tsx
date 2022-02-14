import * as React from 'react';
import {
    isEmpty,
    isFinite,
    kebabCase,
    map,
} from 'lodash';
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
import InputMasked from 'react-text-mask';
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
    onCancel: Function;
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
        validationState: state.timeActivity?.validation ?? null,
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

        this.onBreakTimeChanged = this.onBreakTimeChanged.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
        this.onCustomerSelectionChanged = this.onCustomerSelectionChanged.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);
        this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
        this.onEmployeeSelectionChanged = this.onEmployeeSelectionChanged.bind(this);
        this.onEndTimeChanged = this.onEndTimeChanged.bind(this);
        this.onHourlyBillingRateChanged = this.onHourlyBillingRateChanged.bind(this);
        this.onIsBillableChanged = this.onIsBillableChanged.bind(this);
        this.onProductSelectionChanged = this.onProductSelectionChanged.bind(this);
        this.onStartTimeChanged = this.onStartTimeChanged.bind(this);
        this.onTimeZoneSelectionChanged = this.onTimeZoneSelectionChanged.bind(this);
    }

    public render() {
        const {
            customers,
            employees,
            isOpen,
            isDeleting,
            isSaving,
            mode,
            onClose,
            products,
            timeActivity,
            timeZones,
            validationState,
        } = this.props;

        const breakTime = timeActivity?.break ?? '';
        const customerId = timeActivity?.customerId ?? '';
        const description = timeActivity?.description ?? '';
        const employeeId = timeActivity?.employeeId ?? '';
        const endTime = timeActivity?.endTime ?? '';
        const hourlyRateAsString = timeActivity?.hourlyBillingRateAsString ?? '';
        const isBillable = timeActivity?.isBillable ?? false;
        const productId = timeActivity?.productId ?? '';
        const startTime = timeActivity?.startTime ?? '';
        const timeActivityDate = timeActivity?.date ?? '';
        const timeZone = timeActivity?.timeZone ?? '';
        const canSave = validationState?.canSave ?? false;

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
                                disabled={isSaving || !canSave}
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
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--time_activity_date_input`}>Date</Label>
                                    <Input
                                        id={`${this.bemBlockName}--time_activity_date_input`}
                                        name="time_activity_date_input"
                                        onChange={this.onDateChanged}
                                        type="date"
                                        value={timeActivityDate}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--time_zone_select`}>Time Zone</Label>
                                    <select
                                        className="selectpicker form-control"
                                        data-width="auto"
                                        id={`${this.bemBlockName}--time_zone_select`}
                                        name="time_zone_select"
                                        onChange={this.onTimeZoneSelectionChanged}
                                        placeholder="Select Time Zone"
                                        value={timeZone}
                                    >
                                        <option value="">Select</option>
                                        {map(timeZones, (tz) => ((
                                            <option key={this.getTimeZoneKey(tz.id)} value={tz.id}>
                                                {tz.displayName}
                                            </option>
                                        )))}
                                    </select>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--customer_select`}>Customer</Label>
                                    <select
                                        className="selectpicker form-control"
                                        data-width="auto"
                                        id={`${this.bemBlockName}--customer_select`}
                                        name="customer_select"
                                        onChange={this.onCustomerSelectionChanged}
                                        placeholder="Select Customer"
                                        value={customerId}
                                    >
                                        <option value="">Select</option>
                                        {map(customers, (c) => ((
                                            <option key={`customer-${c.id}`} value={c.id}>
                                                {c.displayName}
                                            </option>
                                        )))}
                                    </select>
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--start_time_input`}>Start Time</Label>
                                    <Input
                                        id={`${this.bemBlockName}--start_time_input`}
                                        name="start_time_input"
                                        onChange={this.onStartTimeChanged}
                                        type="time"
                                        value={startTime}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--activity_select`}>Activity</Label>
                                    <select
                                        className="selectpicker form-control"
                                        data-width="auto"
                                        id={`${this.bemBlockName}--activity_select`}
                                        name="activity_select"
                                        onChange={this.onProductSelectionChanged}
                                        placeholder="Select Activity"
                                        value={productId}
                                    >
                                        <option value="">Select</option>
                                        {map(products, (p) => ((
                                            <option key={`product-${p.id}`} value={p.id}>
                                                {p.name}
                                            </option>
                                        )))}
                                    </select>
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--end_time_input`}>End Time</Label>
                                    <Input
                                        id={`${this.bemBlockName}--end_time_input`}
                                        name="end_time_input"
                                        onChange={this.onEndTimeChanged}
                                        type="time"
                                        value={endTime}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--employee_select`}>Employee</Label>
                                    <select
                                        className="selectpicker form-control"
                                        data-width="auto"
                                        id={`${this.bemBlockName}--employee_select`}
                                        name="employee_select"
                                        onChange={this.onEmployeeSelectionChanged}
                                        placeholder="Select Employee"
                                        value={employeeId}
                                    >
                                        <option value="">Select</option>
                                        {map(employees, (e) => ((
                                            <option key={`employee-${e.id}`} value={e.id}>
                                                {e.displayName}
                                            </option>
                                        )))}
                                    </select>
                                </FormGroup>
                            </Col>
                            <Col sm={6}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--break_time_input`}>Break</Label>
                                    <InputMasked
                                        className="form-control"
                                        id={`${this.bemBlockName}--break_time_input`}
                                        mask={[/\d/, ':', /\d/, /\d/]}
                                        name="break_time_input"
                                        onChange={this.onBreakTimeChanged}
                                        placeholder="hh:mm"
                                        type="text"
                                        value={breakTime}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={3}>
                                <FormGroup
                                    check
                                    inline
                                >
                                    <Input
                                        checked={isBillable}
                                        id={`${this.bemBlockName}--is_billable_checkbox`}
                                        name="is_billable_checkbox"
                                        onChange={this.onIsBillableChanged}
                                        type="checkbox"
                                    />
                                    <Label
                                        check
                                        for={`${this.bemBlockName}--is_billable_checkbox`}>Billable&nbsp;(/hr)
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <Input
                                    id={`${this.bemBlockName}--hourly_billing_rate_input`}
                                    onChange={this.onHourlyBillingRateChanged}
                                    step="any"
                                    style={{ textAlign: 'right' }}
                                    type="number"
                                    value={hourlyRateAsString}
                                />
                            </Col>
                        </Row>
                        <Row form>
                            <Col sm={12}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--description_textarea`}>Description</Label>
                                    <Input
                                        id={`${this.bemBlockName}--description_textarea`}
                                        name="description_textarea"
                                        onChange={this.onDescriptionChanged}
                                        type="textarea"
                                        value={description}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {isEmpty(validationState?.message) ? '\u00A0' : validationState?.message}
                </ModalFooter>
            </Modal>
        );
    }

    private getTimeZoneKey(timeZoneId: string) {
        const tzIdProgrammaticKey = kebabCase(
            timeZoneId
                .replace('-', 'minus')
                .replace('-', 'plus'),
        );

        return `tz-${tzIdProgrammaticKey}`;
    }

    private onBreakTimeChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateBreakTime } = this.props;
        updateBreakTime(event.currentTarget.value);
    }

    private onClickCancel(event: React.MouseEvent<any>) {
        const {
            onCancel,
            resetDirtyTimeActivity,
        } = this.props;

        resetDirtyTimeActivity();
        onCancel(event);
    }

    private onClickDelete(event: React.MouseEvent<any>) {
        this.logger.debug('Deleting the time activity...');
    }

    private onClickSave(event: React.MouseEvent<any>) {
        this.logger.info('Saving the time activity...');

        const {
            mode,
            onClose,
            saveNewTimeActivity,
            updateTimeActivity,
        } = this.props;

        if (mode === Mode.Add) {
            saveNewTimeActivity();
            onClose(event); // TODO/FIXME: Do we want to close the modal on error?  Right now we have to in order to see the error message.  Need to rethink error handling???
        } else { // Edit Model
            updateTimeActivity();
            onClose(event);
        }
    }

    private onCustomerSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updateCustomer } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateCustomer(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateCustomer(selectedOption.value);
    }

    private onDateChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateDate } = this.props;
        updateDate(event.currentTarget.value ?? null);
    }

    private onDescriptionChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateDescription } = this.props;
        updateDescription(event.currentTarget.value ?? null);
    }

    private onEmployeeSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updateEmployee } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateEmployee(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateEmployee(selectedOption.value);
    }

    private onEndTimeChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateEndTime } = this.props;
        updateEndTime(event.currentTarget.value ?? null);
    }

    private onHourlyBillingRateChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const { updateHourlyRate } = this.props;

        const amountAsString = event.currentTarget.value;
        const parsedAmount = parseFloat(amountAsString);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        updateHourlyRate(safeValueForUpdate, amountAsString);
    }

    private onIsBillableChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const { updateIsBillable } = this.props;
        updateIsBillable(event.target.checked);
    }

    private onProductSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updateProduct } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateProduct(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateProduct(selectedOption.value);
    }

    private onStartTimeChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateStartTime } = this.props;
        updateStartTime(event.currentTarget.value ?? null);
    }

    private onTimeZoneSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { updateTimeZone } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateTimeZone(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateTimeZone(selectedOption.value);
    }
}

export default connector(TimeActivityEntryModalDialog);