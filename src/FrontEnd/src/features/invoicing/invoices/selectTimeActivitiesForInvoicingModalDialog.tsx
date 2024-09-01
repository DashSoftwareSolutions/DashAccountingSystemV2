import React, { useCallback } from 'react';
import ClassNames from 'classnames';
import {
    isEmpty,
    isNil,
    without,
} from 'lodash';
import {
    DateTime,
    Duration,
} from 'luxon';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
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
import { actionCreators as invoiceActionCreators } from './redux';
import { RootState } from '../../../app/globalReduxStore';
import AmountDisplay from '../../../common/components/amountDisplay';
import Loader from '../../../common/components/loader';
import { DEFAULT_ASSET_TYPE } from '../../../common/constants';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import { AmountType } from '../../../common/models';
import { displayHhMm } from '../../../common/utilities/stringUtils';
import useNamedState from '../../../common/utilities/useNamedState';
import { TimeActivity } from '../../time-tracking/time-activities/models';

const logger: ILogger = new Logger('Select Time Activities For Invoicing Modal');
const bemBlockName: string = 'select_time_activities_for_invoicing_modal';

interface SelectTimeActivitiesForInvoicingModalDialogOwnProps {
    isOpen: boolean;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: RootState) => ({
    defaultAssetType: state?.application?.selectedTenant?.defaultAssetType ?? DEFAULT_ASSET_TYPE,
    startDate: state?.invoice?.details.unbilledTimeActivitiesFilterStartDate ?? null,
    endDate: state?.invoice?.details.unbilledTimeActivitiesFilterEndDate ?? null,
    isFetching: state?.invoice?.details.isFetchingUnbilledTimeActivities ?? false,
    timeActivities: state?.invoice?.details.unbilledTimeActivities ?? [],
});

const mapDispatchToProps = {
    ...invoiceActionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type SelectTimeActivitiesForInvoicingModalDialogReduxProps = ConnectedProps<typeof connector>;

type PropTypes = SelectTimeActivitiesForInvoicingModalDialogOwnProps &
    SelectTimeActivitiesForInvoicingModalDialogReduxProps;

function SelectTimeActivitiesForInvoicingModalDialog(props: PropTypes) {
    const {
        addSelectedTimeActivitiesAsInvoiceLineItems,
        defaultAssetType,
        endDate,
        isFetching,
        isOpen,
        onClose,
        requestUnbilledTimeActivities,
        startDate,
        timeActivities,
        updateUnbilledTimeActivitiesFilterEndDate,
        updateUnbilledTimeActivitiesFilterStartDate,
    } = props;

    const [hasCheckedForTimeActivities, setHasCheckedForTimeActivities] = useNamedState<boolean>('hasCheckedForTimeActivities', false);
    const [isSelectAllChecked, setIsSelectAllChecked] = useNamedState<boolean>('isSelectAllChecked', false);
    const [selectedTimeActivityIds, setSelectedTimeActivityIds] = useNamedState<string[]>('selectedTimeActivityIds', []);

    const onClickAddSelectedItemsToInvoice = useCallback((event: React.MouseEvent<any>) => {
        const selectedTimeActivities = timeActivities.filter(
                (ta: TimeActivity) => selectedTimeActivityIds.includes(ta.id ?? ''),
        );

        // Dispatch action to add the selected Time Activties to the Invoice
        addSelectedTimeActivitiesAsInvoiceLineItems(selectedTimeActivities);

        // Close the modal
        onClose(event);

        // Reset component state
        setHasCheckedForTimeActivities(false);
        setIsSelectAllChecked(false);
        setSelectedTimeActivityIds([]);
    }, [
        addSelectedTimeActivitiesAsInvoiceLineItems,
        onClose,
        selectedTimeActivityIds,
        setIsSelectAllChecked,
        setHasCheckedForTimeActivities,
        setSelectedTimeActivityIds,
        timeActivities,
    ]);

    const onClickCancel = (event: React.MouseEvent<any>) => {
        // Reset component state
        setHasCheckedForTimeActivities(false);
        setIsSelectAllChecked(false);
        setSelectedTimeActivityIds([]);

        // Close the modal
        onClose(event);
    };

    const onClickCheckForUnbilledTimeActivities = (event: React.MouseEvent<any>) => {
        requestUnbilledTimeActivities();
        setHasCheckedForTimeActivities(true);
    };

    const onEndDateChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateUnbilledTimeActivitiesFilterEndDate(event.currentTarget.value ?? null);
    };

    const onSelectAllCheckChanged = useCallback((_: React.FormEvent<HTMLInputElement>) => {
        if (isSelectAllChecked) { // going from all selected to all unselected
            setSelectedTimeActivityIds([]);
        } else { // going from not all selected to all selected
            setSelectedTimeActivityIds(timeActivities.map((ta) => ta.id ?? '').filter((id) => id !== ''));
        }

        setIsSelectAllChecked(!isSelectAllChecked);

    }, [
        isSelectAllChecked,
        setIsSelectAllChecked,
        setSelectedTimeActivityIds,
        timeActivities,
    ]);

    const onSelectTimeActivityCheckChanged = useCallback((_: React.FormEvent<HTMLInputElement>, timeActivityId: string) => {
        const wasSelected = selectedTimeActivityIds.some((id) => id === timeActivityId);

        const nextSelectedIds = wasSelected ?
            without(selectedTimeActivityIds, timeActivityId) :
            [...selectedTimeActivityIds, timeActivityId];

        const nextIsSelectAllChecked = timeActivities.length === selectedTimeActivityIds.length;

        setSelectedTimeActivityIds(nextSelectedIds);
        setIsSelectAllChecked(nextIsSelectAllChecked);

    }, [
        selectedTimeActivityIds,
        setIsSelectAllChecked,
        setSelectedTimeActivityIds,
        timeActivities,
    ]);

    const onStartDateChanged = (event: React.FormEvent<HTMLInputElement>) => {
        updateUnbilledTimeActivitiesFilterStartDate(event.currentTarget.value ?? null);
    };

    const areAnyTimeActivitiesSelected = !isEmpty(selectedTimeActivityIds);

    const hasValidDateRange = !isNil(startDate) &&
        !isNil(endDate) &&
        DateTime.fromISO(endDate) >= DateTime.fromISO(startDate);

    const tableClasses = ClassNames(
        'table',
        'table-hover',
        'table-sm',
        'report-table',
        `${bemBlockName}--time_activities_table`,
    );

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
                    <Col md={6}>
                        <h5>Add Unbilled Time Activities to Invoice</h5>
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
                                width: 132,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            color="success"
                            disabled={!areAnyTimeActivitiesSelected}
                            id={`${bemBlockName}--add_selected_button`}
                            onClick={onClickAddSelectedItemsToInvoice}
                            style={{ width: 132 }}
                        >
                            Add Selected
                        </Button>
                    </Col>
                </Row>
            </ModalHeader>

            <ModalBody>
                <Form>
                    <Row>
                        <Col md={3}>
                            <Label for={`${bemBlockName}--date_range_start_input`}>Date Range Start</Label>

                            <Input
                                id={`${bemBlockName}--date_range_start_input`}
                                name="date_range_start_input"
                                onChange={onStartDateChanged}
                                type="date"
                                value={startDate ?? ''}
                            />
                        </Col>

                        <Col md={3}>
                            <Label for={`${bemBlockName}--date_range_end_input`}>Date Range End</Label>
                            <Input
                                id={`${bemBlockName}--date_range_end_input`}
                                name="date_range_end_input"
                                onChange={onEndDateChanged}
                                type="date"
                                value={endDate ?? ''}
                            />
                        </Col>

                        <Col
                            className="text-end"
                            md={6}
                        >
                            <Button
                                color="success"
                                disabled={!hasValidDateRange}
                                id={`${bemBlockName}--check_for_unbilled_time_button`}
                                onClick={onClickCheckForUnbilledTimeActivities}
                                outline
                                style={{
                                    marginTop: 32,
                                    width: 220,
                                }}
                            >
                                Check for Unbilled Time
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            className={`${bemBlockName}--main_content_container`}
                            sm={12}
                        >
                            {isFetching && (<Loader />)}

                            {!isFetching && hasCheckedForTimeActivities && isEmpty(timeActivities) && (
                                <p>No Unbilled Time Activities found for this Customer and the selected date range.</p>
                            )}

                            {!isFetching && hasCheckedForTimeActivities && !isEmpty(timeActivities) && (
                                <table className={tableClasses}>
                                    <thead>
                                        <tr>
                                            <th className="col-md-1 bg-white sticky-top sticky-border">
                                                <FormGroup
                                                    check
                                                    inline
                                                >
                                                    <Input
                                                        checked={isSelectAllChecked}
                                                        id={`${bemBlockName}--select_all_checkbox`}
                                                        onChange={onSelectAllCheckChanged}
                                                        type="checkbox"
                                                    />
                                                </FormGroup>
                                            </th>
                                            <th className="col-md-2 bg-white sticky-top sticky-border">Activity Date</th>
                                            <th className="col-md-5 bg-white sticky-top sticky-border">Memo/Description</th>
                                            <th className="col-md-2 bg-white sticky-top sticky-border text-right">Duration</th>
                                            <th className="col-md-2 bg-white sticky-top sticky-border text-right">Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {timeActivities.map((ta) => ((
                                            <tr key={ta.id}>
                                                <td>
                                                    <FormGroup
                                                        check
                                                        inline
                                                    >
                                                        <Input
                                                            checked={selectedTimeActivityIds.some((id) => id === ta.id)}
                                                            id={`${bemBlockName}--select_checkbox_${ta.id}`}
                                                            onChange={(e: React.FormEvent<HTMLInputElement>) => onSelectTimeActivityCheckChanged(e, ta.id ?? '')}
                                                            type="checkbox"
                                                        />
                                                    </FormGroup>
                                                </td>
                                                <td>
                                                    {/* TODO/FIXME: Would like localization support but want months and days to have two digits always (w/ leading zeros if necessary) in en-US locale */}
                                                    {/*DateTime.fromISO(ta.date ?? '').toLocaleString(DateTime.DATE_SHORT)*/}
                                                    {DateTime.fromISO(ta.date ?? '').toFormat('MM/dd/yyyy')}
                                                </td>
                                                <td>
                                                    <span
                                                        dangerouslySetInnerHTML={{ __html: ta.description?.replace(/\r?\n/g, '<br />') ?? '' }}
                                                        style={{ wordWrap: 'break-word' }}
                                                    />
                                                </td>
                                                <td className="text-end">
                                                    {displayHhMm(Duration.fromISOTime(ta.totalTime ?? ''))}
                                                </td>
                                                <td className="text-end">
                                                    <AmountDisplay
                                                        amount={{
                                                            amount: ta.totalBillableAmount ?? 0,
                                                            amountType: AmountType.Debit,
                                                            assetType: defaultAssetType,
                                                        }}
                                                        showCurrency
                                                    />
                                                </td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            )}
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

export default connector(SelectTimeActivitiesForInvoicingModalDialog);
