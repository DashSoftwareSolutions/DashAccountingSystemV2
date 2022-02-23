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
    map,
    some,
    without,
} from 'lodash';
import ClassNames from 'classnames';
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import { DEFAULT_ASSET_TYPE } from '../common/Constants';
import { displayHhMm } from '../common/StringUtils';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import AmountType from '../models/AmountType';
import AmountDisplay from './AmountDisplay';
import * as InvoiceStore from '../store/Invoice';

interface SelectTimeActivitiesForInvoicingModalDialogOwnProps {
    isOpen: boolean;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        defaultAssetType: state?.tenants?.selectedTenant?.defaultAssetType ?? DEFAULT_ASSET_TYPE,
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
        this.onSelectAllCheckChanged = this.onSelectAllCheckChanged.bind(this);
        this.onSelectTimeActivityCheckChanged = this.onSelectTimeActivityCheckChanged.bind(this);
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
                                    outline
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
                                ) : !isEmpty(timeActivities) ?
                                        this.renderTimeActivities()
                                    : hasCheckedForTimeActivities ? (
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

    private onSelectAllCheckChanged(_: React.FormEvent<HTMLInputElement>) {
        this.setState((prevState) => {
            const { isSelectAllChecked: wasSelectAllChecked } = prevState;
            const { timeActivities } = this.props;

            const updatedState: SelectTimeActivitiesForInvoicingModalDialogState = {
                ...prevState as Pick<SelectTimeActivitiesForInvoicingModalDialogState, keyof SelectTimeActivitiesForInvoicingModalDialogState>,
                isSelectAllChecked: !wasSelectAllChecked,
            };

            if (wasSelectAllChecked) {
                // going from checked to unchecked - deselect all the things!
                updatedState.selectedTimeActivityIds = [];
            } else {
                // going from unchecked to checked - select all the things!
                updatedState.selectedTimeActivityIds = map(timeActivities, (ta) => ta.id ?? '');
            }

            return updatedState;
        })
    }

    private onSelectTimeActivityCheckChanged(_: React.FormEvent<HTMLInputElement>, timeActivityId: string) {
        this.setState(({ selectedTimeActivityIds: prevSelectedTimeActivityIds }) => {
            const { timeActivities } = this.props;

            const wasSelected = some(prevSelectedTimeActivityIds, (id) => id === timeActivityId);

            const selectedTimeActivityIds = wasSelected ?
                without(prevSelectedTimeActivityIds, timeActivityId) :
                [...prevSelectedTimeActivityIds, timeActivityId];

            const isSelectAllChecked = timeActivities.length === selectedTimeActivityIds.length;

            return {
                isSelectAllChecked,
                selectedTimeActivityIds, 
            };
        });
    }

    private onStartDateChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateUnbilledTimeActivitiesFilterStartDate } = this.props;
        updateUnbilledTimeActivitiesFilterStartDate(event.currentTarget.value ?? null);
    }

    private renderTimeActivities(): JSX.Element {
        const {
            defaultAssetType,
            timeActivities,
        } = this.props;

        const {
            isSelectAllChecked,
            selectedTimeActivityIds,
        } = this.state;

        const tableClasses = ClassNames(
            'table',
            'table-hover',
            'table-sm',
            'report-table',
            `${this.bemBlockName}--time_activities_table`,
        );

        return (
            <table className={tableClasses}>
                <thead>
                    <tr>
                        <th className="col-md-1 bg-white sticky-top sticky-border">
                            <FormGroup check inline>
                                <Input
                                    checked={isSelectAllChecked}
                                    id={`${this.bemBlockName}--select_all_checkbox`}
                                    onChange={this.onSelectAllCheckChanged}
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
                    {map(timeActivities, (ta) => ((
                        <tr key={ta.id}>
                            <td>
                                <FormGroup check inline>
                                    <Input
                                        checked={some(selectedTimeActivityIds, (id) => id === ta.id)}
                                        id={`${this.bemBlockName}--select_checkbox_${ta.id}`}
                                        onChange={(e: React.FormEvent<HTMLInputElement>) => this.onSelectTimeActivityCheckChanged(e, ta.id ?? '')}
                                        type="checkbox"
                                    />
                                </FormGroup>
                            </td>
                            <td>
                                {moment(ta.date).format('L')}
                            </td>
                            <td>
                                <span
                                    dangerouslySetInnerHTML={{ __html: ta.description?.replace(/\r?\n/g, '<br />') ?? '' }}
                                    style={{ wordWrap: 'break-word' }}
                                />
                            </td>
                            <td className="text-right">
                                {displayHhMm(moment.duration(ta.totalTime))}
                            </td>
                            <td className="text-right">
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
        );
    }
}

export default connector(SelectTimeActivitiesForInvoicingModalDialog);