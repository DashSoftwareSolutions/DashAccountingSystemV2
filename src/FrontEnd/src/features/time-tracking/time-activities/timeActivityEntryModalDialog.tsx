import React, { useCallback } from 'react';
import {
    isEmpty,
    isFinite,
    isNil,
    kebabCase,
} from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import InputMasked from 'react-text-mask';
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
import { actionCreators as timeTrackingActionCreators } from './redux';
import { RootState } from '../../../app/globalReduxStore';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import { Mode } from '../../../common/models';

interface TimeActivityEntryModalDialogOwnProps {
    isOpen: boolean;
    mode: Mode | null;
    onCancel: React.MouseEventHandler<any>;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: RootState) => {
    return {
        customers: state?.customers?.list.customers ?? [],
        employees: state?.employees?.employees ?? [],
        isDeleting: state.timeTracking?.isDeleting ?? false,
        isSaving: state.timeTracking?.isSaving ?? false,
        products: state.products?.products ?? [],
        timeActivity: state.timeTracking?.dirtyTimeActivity,
        timeZones: state.lookups?.timeZones ?? [],
        validationState: state.timeTracking?.validation ?? null,
    };
};

const mapDispatchToProps = {
    ...timeTrackingActionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TimeActivityEntryModalDialogReduxProps = ConnectedProps<typeof connector>;

type PropTypes = TimeActivityEntryModalDialogOwnProps & TimeActivityEntryModalDialogReduxProps;

const logger: ILogger = new Logger('Time Activity Entry Modal');
const bemBlockName: string = 'time_activity_entry_modal';

const getTimeZoneKey = (timeZoneId: string): string => {
    const tzIdProgrammaticKey = kebabCase(
        timeZoneId
            .replace('-', 'minus')
            .replace('-', 'plus'),
    );

    return `tz-${tzIdProgrammaticKey}`;
};

function TimeActivityEntryModalDialog(props: PropTypes) {
    const {
        customers,
        deleteTimeActivity,
        employees,
        isOpen,
        isDeleting,
        isSaving,
        mode,
        onCancel,
        onClose,
        products,
        resetDirtyTimeActivity,
        saveNewTimeActivity,
        timeActivity,
        timeZones,
        updateBreakTime,
        updateCustomer,
        updateDate,
        updateDescription,
        updateEmployee,
        updateEndTime,
        updateHourlyRate,
        updateIsBillable,
        updateProduct,
        updateStartTime,
        updateTimeActivity,
        updateTimeZone,
        validationState,
    } = props;

    const onBreakTimeChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateBreakTime(event.currentTarget.value);
    };

    const onClickCancel = (event: React.MouseEvent<any>) => {
        onCancel(event);
    };

    const onClickDelete = useCallback((event: React.MouseEvent<any>) => {
        logger.info('Deleting the time activity...');

        if (isNil(timeActivity) ||
            isNil(timeActivity.id)) {
            return;
        }

        deleteTimeActivity(timeActivity?.id);
        onClose(event);
    }, [
        deleteTimeActivity,
        onClose,
        timeActivity,
    ]);

    const onClickSave = useCallback((event: React.MouseEvent<any>) => {
        logger.info('Saving the time activity...');

        if (mode === Mode.Add) {
            saveNewTimeActivity();
            onClose(event); // TODO/FIXME: Do we want to close the modal on error?  Right now we have to in order to see the error message.  Need to rethink error handling???
        } else { // Edit Model
            updateTimeActivity();
            onClose(event);
        }
    }, [
        mode,
        onClose,
        saveNewTimeActivity,
        updateTimeActivity,
    ]);

    const onCustomerSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateCustomer(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateCustomer(selectedOption.value);
    };

    const onDateChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateDate(event.currentTarget.value ?? null);
    };

    const onDescriptionChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateDescription(event.currentTarget.value ?? null);
    };

    const onEmployeeSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateEmployee(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateEmployee(selectedOption.value);
    };

    const onEndTimeChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateEndTime(event.currentTarget.value ?? null);
    };

    const onHourlyBillingRateChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amountAsString = event.currentTarget.value;
        const parsedAmount = parseFloat(amountAsString);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        updateHourlyRate(safeValueForUpdate, amountAsString);
    };

    const onIsBillableChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateIsBillable(event.target.checked);
    };

    const onProductSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateProduct(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateProduct(selectedOption.value);
    };

    const onStartTimeChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateStartTime(event.currentTarget.value ?? null);
    };

    const onTimeZoneSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            updateTimeZone(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        updateTimeZone(selectedOption.value);
    };

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
            backdrop="static"
            centered
            className={bemBlockName}
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
                        <h5>Time Activity</h5>
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

                        {mode === Mode.Edit ? (
                            <Button
                                color="danger"
                                disabled={isDeleting} // TODO: Disable if it shouldn't be deleted per business rules (e.g. tied to an Invoice, etc.)
                                id={`${bemBlockName}--delete_button`}
                                onClick={onClickDelete}
                                style={{
                                    marginRight: 22,
                                    width: 88,
                                }}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        ) : null}

                        <Button
                            color="success"
                            disabled={isSaving || !canSave}
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
                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--time_activity_date_input`}>Date</Label>

                                <Input
                                    id={`${bemBlockName}--time_activity_date_input`}
                                    name="time_activity_date_input"
                                    onChange={onDateChanged}
                                    type="date"
                                    value={timeActivityDate}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--time_zone_select`}>Time Zone</Label>

                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${bemBlockName}--time_zone_select`}
                                    name="time_zone_select"
                                    onChange={onTimeZoneSelectionChanged}
                                    value={timeZone}
                                >
                                    <option value="">Select Time Zone</option>

                                    {timeZones.map((tz) => ((
                                        <option
                                            key={getTimeZoneKey(tz.id)}
                                            value={tz.id}
                                        >
                                            {tz.displayName}
                                        </option>
                                    )))}
                                </select>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--customer_select`}>Customer</Label>

                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${bemBlockName}--customer_select`}
                                    name="customer_select"
                                    onChange={onCustomerSelectionChanged}
                                    value={customerId}
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
                            </FormGroup>
                        </Col>

                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--start_time_input`}>Start Time</Label>

                                <Input
                                    id={`${bemBlockName}--start_time_input`}
                                    name="start_time_input"
                                    onChange={onStartTimeChanged}
                                    type="time"
                                    value={startTime}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--activity_select`}>Activity</Label>

                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${bemBlockName}--activity_select`}
                                    name="activity_select"
                                    onChange={onProductSelectionChanged}
                                    value={productId}
                                >
                                    <option value="">Select Activity</option>

                                    {products.map((p) => ((
                                        <option
                                            key={`product-${p.id}`}
                                            value={p.id}
                                        >
                                            {p.name}
                                        </option>
                                    )))}
                                </select>
                            </FormGroup>
                        </Col>

                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--end_time_input`}>End Time</Label>
                                <Input
                                    id={`${bemBlockName}--end_time_input`}
                                    name="end_time_input"
                                    onChange={onEndTimeChanged}
                                    type="time"
                                    value={endTime}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--employee_select`}>Employee</Label>
                                <select
                                    className="selectpicker form-control"
                                    data-width="auto"
                                    id={`${bemBlockName}--employee_select`}
                                    name="employee_select"
                                    onChange={onEmployeeSelectionChanged}
                                    value={employeeId}
                                >
                                    <option value="">Select Employee</option>

                                    {employees.map((e) => ((
                                        <option
                                            key={`employee-${e.id}`}
                                            value={e.id}
                                        >
                                            {e.displayName}
                                        </option>
                                    )))}
                                </select>
                            </FormGroup>
                        </Col>

                        <Col sm={6}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--break_time_input`}>Break</Label>

                                <InputMasked
                                    className="form-control"
                                    id={`${bemBlockName}--break_time_input`}
                                    mask={[/\d/, ':', /\d/, /\d/]}
                                    name="break_time_input"
                                    onChange={onBreakTimeChanged}
                                    placeholder="hh:mm"
                                    type="text"
                                    value={breakTime}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={3}>
                            <FormGroup
                                check
                                inline
                            >
                                <Input
                                    checked={isBillable}
                                    id={`${bemBlockName}--is_billable_checkbox`}
                                    name="is_billable_checkbox"
                                    onChange={onIsBillableChanged}
                                    type="checkbox"
                                />
                                <Label
                                    check
                                    for={`${bemBlockName}--is_billable_checkbox`}>Billable&nbsp;(/hr)
                                </Label>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <Input
                                id={`${bemBlockName}--hourly_billing_rate_input`}
                                onChange={onHourlyBillingRateChanged}
                                step="any"
                                style={{ textAlign: 'right' }}
                                type="number"
                                value={hourlyRateAsString}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--description_textarea`}>Description</Label>

                                <Input
                                    id={`${bemBlockName}--description_textarea`}
                                    name="description_textarea"
                                    onChange={onDescriptionChanged}
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

export default connector(TimeActivityEntryModalDialog);
