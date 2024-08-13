import React, { useEffect } from 'react';
import {
    groupBy,
    head,
    isEmpty,
    isNil,
    map,
} from 'lodash';
import {
    DateTime,
    Duration,
} from 'luxon';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { TimeActivity } from './models';
import { actionCreators as timeTrackingActionCreators } from './redux';
import { RootState } from '../../../app/globalReduxStore';
import { actionCreators as lookupValueActionCreators } from '../../../app/lookupValues';
import {
    actionCreators as notificationActionCreators,
    NotificationLevel,
} from '../../../app/notifications';
import AmountDisplay from '../../../common/components/amountDisplay';
import LinkButton from '../../../common/components/linkButton';
import Loader from '../../../common/components/loader';
import ReportParametersAndControls from '../../../common/components/reportParametersAndControls';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import {
    AmountType,
    DateRange,
    Mode,
} from '../../../common/models';
import { displayHhMm } from '../../../common/utilities/stringUtils';
import useNamedState from '../../../common/utilities/useNamedState';
import usePrevious from '../../../common/utilities/usePrevious';
import { actionCreators as customerActionCreators } from '../../sales/customers/redux';
import { actionCreators as productActionCreators } from '../../sales/products/redux';
import { actionCreators as employeeActionCreators } from '../employees/redux';

const logger: ILogger = new Logger('Time Tracking Page');
const bemBlockName: string = 'time_tracking_page';

const mapStateToProps = (state: RootState) => ({
    customers: state?.customers?.list.customers ?? [],
    dateRangeEnd: state?.timeTracking?.dateRangeEnd,
    dateRangeStart: state?.timeTracking?.dateRangeStart,
    employees: state?.employees?.employees ?? [],
    isDeleting: state.timeTracking?.isDeleting ?? false,
    isFetchingCustomers: state.customers?.list.isFetching ?? false,
    isFetchingEmployees: state.employees?.isFetching ?? false,
    isFetchingProducts: state.products?.isFetching ?? false,
    isFetchingTimeActivityData: state.timeTracking?.isFetching ?? false,
    isSaving: state.timeTracking?.isSaving ?? false,
    reportData: state?.timeTracking?.detailsReportData ?? null,
    savedTimeActivity: state.timeTracking?.existingTimeActivity ?? null,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...customerActionCreators,
    ...employeeActionCreators,
    ...productActionCreators,
    ...timeTrackingActionCreators,
    requestLookupValues: lookupValueActionCreators.requestLookupValues,
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TimeTrackingPageReduxProps = ConnectedProps<typeof connector>;

type TimeTrackingPageProps = TimeTrackingPageReduxProps;

function TimeTrackingPage(props: TimeTrackingPageProps) {
    const {
        customers,
        dateRangeEnd,
        dateRangeStart,
        employees,
        initializeNewTimeActivity,
        isDeleting,
        isFetchingCustomers,
        isFetchingEmployees,
        isFetchingProducts,
        isFetchingTimeActivityData,
        isSaving,
        reportData,
        requestCustomers,
        requestEmployees,
        requestLookupValues,
        requestProducts,
        requestTimeActivityDetailsReportData,
        resetDirtyTimeActivity,
        resetTimeActivityDetailsReportData,
        savedTimeActivity,
        selectedTenant,
        selectTimeActivity,
        showAlert,
        updateDateRange,
    } = props;

    const wasDeleting = usePrevious(isDeleting);
    const wasSaving = usePrevious(isSaving);

    const [isTimeActivityEntryModalOpen, setIsTimeActivityEntryModalOpen] = useNamedState<boolean>('isTimeActivityEntryModalOpen', false);
    const [timeActivityEntryModalMode, setTimeActivityEntryModalMode] = useNamedState<Mode | null>('timeActivityEntryModalMode', null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    // fetch needed data on mount
    useEffect(() => {
        requestLookupValues();
        requestCustomers();
        requestEmployees();
        requestProducts();
        requestTimeActivityDetailsReportData();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle save action completed
    useEffect(() => {
        if (wasSaving && !isSaving) {
            logger.info('Finished saving!');

            if (timeActivityEntryModalMode === Mode.Add &&
                !isNil(savedTimeActivity)) {
                showAlert(NotificationLevel.Success, 'Successfully created the Time Activity', true);
                resetDirtyTimeActivity();
                resetTimeActivityDetailsReportData();
                requestTimeActivityDetailsReportData();
            } else if (timeActivityEntryModalMode === Mode.Edit) {
                // TODO/FIXME: How to detect if save was unsuccessful?!
                // For now, assume it succeeded
                showAlert(NotificationLevel.Success, 'Successfully updated the Time Activity', true);
                resetDirtyTimeActivity();
                resetTimeActivityDetailsReportData();
                requestTimeActivityDetailsReportData();
            }
        }
    }, [
        isSaving,
        requestTimeActivityDetailsReportData,
        resetDirtyTimeActivity,
        resetTimeActivityDetailsReportData,
        savedTimeActivity,
        showAlert,
        timeActivityEntryModalMode,
        wasSaving,
    ]);

    // handle delete action completed
    useEffect(() => {
        if (wasDeleting && !isDeleting) {
            logger.info('Finished deleting!');

            // TODO/FIXME: How to detect if delete was unsuccessful?!
            // For now, assume it succeeded
            showAlert(NotificationLevel.Success, 'Successfully deleted the Time Activity', true);
            resetDirtyTimeActivity();
            resetTimeActivityDetailsReportData();
            requestTimeActivityDetailsReportData();
        }
    }, [
        isDeleting,
        requestTimeActivityDetailsReportData,
        resetDirtyTimeActivity,
        resetTimeActivityDetailsReportData,
        showAlert,
        wasDeleting,
    ]);

    const onCancelTimeEntryModal = (event: React.MouseEvent<any>) => {
        onCloseTimeActivityEntryModal(event, true);
    };

    const onClickExistingTimeActivity = (timeActivity: TimeActivity) => {
        selectTimeActivity(timeActivity);
        setIsTimeActivityEntryModalOpen(true);
        setTimeActivityEntryModalMode(Mode.Edit);
    };

    const onClickNewTimeActivity = () => {
        initializeNewTimeActivity();
        setIsTimeActivityEntryModalOpen(true);
        setTimeActivityEntryModalMode(Mode.Add);
    };

    const onCloseTimeActivityEntryModal = (_: React.MouseEvent<any>, isCancelling: boolean = false) => {
        setIsTimeActivityEntryModalOpen(false);

        if (isCancelling) {
            setTimeActivityEntryModalMode(null);
        }
    };

    const onRunReport = (newDateRange: DateRange) => {
        resetTimeActivityDetailsReportData();
        updateDateRange(newDateRange);
        requestTimeActivityDetailsReportData();
    };

    const isFetching = isFetchingCustomers ||
        isFetchingEmployees ||
        isFetchingProducts ||
        isFetchingTimeActivityData;

    const hasData = !isNil(reportData) && !isEmpty(reportData.timeActivities);

    const groupedByCustomer = map(
        groupBy(
            reportData?.timeActivities,
            (ta) => ta.customerId,
        ),
        (grp, customerId) => {
            const first = head(grp);

            return {
                customerId,
                customerNumber: first?.customer?.customerNumber,
                customerDisplayName: first?.customer?.displayName,
                timeActivities: grp,
            };
        },
    );

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col md={6}>
                        <h1>Time Activities Report</h1>
                        <p className="lead">{selectedTenant?.name}</p>
                    </Col>

                    <Col md={6}
                        style={{ textAlign: 'right' }}
                    >
                        <Button
                            color="primary"
                            onClick={onClickNewTimeActivity}
                        >
                            New Time Activity
                        </Button>
                    </Col>
                </Row>
            </div>

            <div id={`${bemBlockName}--content`}>
                <ReportParametersAndControls
                    bemBlockName={bemBlockName}
                    dateRangeEnd={dateRangeEnd ?? null}
                    dateRangeStart={dateRangeStart ?? null}
                    onRunReport={onRunReport}
                />             

                {isFetching && (
                    <Loader />
                )}

                {!isFetching && !hasData && (
                    <p>This report does not contain any data.</p>
                )}

                {!isFetching && hasData && (
                    <table className="table table-hover table-sm report-table">
                        <thead>
                            <tr>
                                <th className="col-md-1 bg-white sticky-top sticky-border">Activity Date</th>
                                <th className="col-md-9 bg-white sticky-top sticky-border">Memo/Description</th>
                                <th className="col-md-1 bg-white sticky-top sticky-border text-end">Duration</th>
                                <th className="col-md-1 bg-white sticky-top sticky-border text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedByCustomer.map((customerGroup) => {
                                let totalDuration = Duration.fromObject({
                                    hours: 0,
                                    minutes: 0,
                                    seconds: 0,
                                    milliseconds: 0,
                                });

                                let totalBillableAmount = 0;

                                return (
                                    <React.Fragment key={`cust-${customerGroup.customerNumber}`}>
                                        <tr>
                                            <td
                                                className="col-md-12"
                                                colSpan={5}
                                            >
                                                <strong>{customerGroup.customerDisplayName}</strong>
                                            </td>
                                        </tr>

                                        {customerGroup.timeActivities.map((timeActivity) => {
                                            totalDuration = totalDuration.plus(Duration.fromISOTime(timeActivity.totalTime ?? '00:00:00'));
                                            totalBillableAmount += timeActivity.totalBillableAmount ?? 0;

                                            return (
                                                <tr key={timeActivity.id}>
                                                    <td className="col-md-1">
                                                        <LinkButton
                                                            className="btn-link-report-item"
                                                            onClick={() => onClickExistingTimeActivity(timeActivity)}
                                                        >
                                                            {DateTime.fromISO(timeActivity.date ?? '').toFormat('MM/dd/yyyy')}
                                                        </LinkButton>
                                                    </td>

                                                    <td className="col-md-9">
                                                        <LinkButton
                                                            className="btn-link-report-item"
                                                            onClick={() => onClickExistingTimeActivity(timeActivity)}
                                                        >
                                                            <span
                                                                dangerouslySetInnerHTML={{ __html: timeActivity?.description?.replace(/\r?\n/g, '<br />') ?? '' }}
                                                                style={{ wordWrap: 'break-word' }}
                                                            />
                                                        </LinkButton>
                                                    </td>

                                                    <td className="col-md-1 text-end">
                                                        <LinkButton
                                                            className="btn-link-report-item"
                                                            onClick={() => onClickExistingTimeActivity(timeActivity)}
                                                            style={{ textAlign: 'right' }}
                                                        >
                                                            {displayHhMm(Duration.fromISOTime(timeActivity.totalTime ?? ''))}
                                                        </LinkButton>
                                                    </td>

                                                    <td className="col-md-1 text-end">
                                                        <LinkButton
                                                            className="btn-link-report-item"
                                                            onClick={() => onClickExistingTimeActivity(timeActivity)}
                                                            style={{ textAlign: 'right' }}
                                                        >
                                                            {timeActivity.isBillable && !isNil(timeActivity.totalBillableAmount) ? (
                                                                <AmountDisplay
                                                                    amount={{
                                                                        amount: timeActivity.totalBillableAmount,
                                                                        amountType: AmountType.Debit,
                                                                        assetType: reportData.defaultAssetType,
                                                                    }}
                                                                    showCurrency={false}
                                                                />
                                                            ) : (
                                                                <span>N/A</span>
                                                            )}
                                                        </LinkButton>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        <tr className="report-total-row">
                                            <td colSpan={2}>
                                                {`Total for ${customerGroup.customerDisplayName}`}
                                            </td>
                                            <td className="text-right">
                                                {displayHhMm(totalDuration)}
                                            </td>
                                            <td className="text-right">
                                                <AmountDisplay
                                                    amount={{
                                                        amount: totalBillableAmount,
                                                        amountType: AmountType.Debit,
                                                        assetType: reportData.defaultAssetType,
                                                    }}
                                                    showCurrency
                                                />
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </React.Fragment>
    );
}

export default connector(TimeTrackingPage);
