import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import {
    groupBy,
    head,
    isEmpty,
    isNil,
    map,
} from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import AmountType from '../models/AmountType';
import AmountDisplay from './AmountDisplay';
import LinkButton from './LinkButton';
import ReportParametersAndControls from './ReportParametersAndControls'; // TODO: Use this initially but neeed one w/ Empliyee and Customer filters
import TenantBasePage from './TenantBasePage';
import TimeActivity from '../models/TimeActivity';
import TimeActivityDetailsReport from '../models/TimeActivityDetailsReport';
import * as CustomerStore from '../store/Customer';
import * as EmployeeStore from '../store/Employee';
import * as TimeActivityStore from '../store/TimeActivity';

const mapStateToProps = (state: ApplicationState) => {
    return {
        reportData: state?.timeActivity?.detailsReportData ?? null,
        customers: state?.customers?.customers ?? [],
        employees: state?.employees?.employees ?? [],
        dateRangeEnd: state?.timeActivity?.dateRangeEnd,
        dateRangeStart: state?.timeActivity?.dateRangeStart,
        isFetchingCustomers: state.customers?.isLoading ?? false,
        isFetchingEmployees: state.employees?.isLoading ?? false,
        isFetchingTimeActivityData: state.timeActivity?.isLoading ?? false,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    ...CustomerStore.actionCreators,
    ...EmployeeStore.actionCreators,
    ...TimeActivityStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TimeActivityDetailsReportPageReduxProps = ConnectedProps<typeof connector>;

type TimeActivityDetailsReportPageProps = TimeActivityDetailsReportPageReduxProps
    & RouteComponentProps;

class TimeActivityDetailsReportPage extends React.PureComponent<TimeActivityDetailsReportPageProps> {
    private bemBlockName: string = 'time_activities_detail_report_page';

    constructor(props: TimeActivityDetailsReportPageProps) {
        super(props);

        this.onClickExistingTimeActivity = this.onClickExistingTimeActivity.bind(this);
        this.onClickNewTimeActivity = this.onClickNewTimeActivity.bind(this);
        this.onDateRangeEndChanged = this.onDateRangeEndChanged.bind(this);
        this.onDateRangeStartChanged = this.onDateRangeStartChanged.bind(this);
        this.onRunReport = this.onRunReport.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const {
            reportData,
            dateRangeEnd,
            dateRangeStart,
            history,
            isFetchingCustomers,
            isFetchingEmployees,
            isFetchingTimeActivityData,
            selectedTenant,
        } = this.props;

        const isFetching = isFetchingCustomers ||
            isFetchingEmployees ||
            isFetchingTimeActivityData;

        console.log('isFetchingCustomers:', isFetchingCustomers);
        console.log('isFetchingEmployees:', isFetchingEmployees);
        console.log('isFetchingTimeActivityReportData:', isFetchingTimeActivityData);
        console.log('isFetching [anything]:', isFetching);

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.TimeTracking}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col md={6}>
                            <h1>Time Activities Report</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button color="primary" onClick={this.onClickNewTimeActivity}>
                                New Time Activity
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <ReportParametersAndControls
                        bemBlockName={this.bemBlockName}
                        dateRangeEnd={dateRangeEnd ?? null}
                        dateRangeStart={dateRangeStart ?? null}
                        onDateRangeEndChanged={this.onDateRangeEndChanged}
                        onDateRangeStartChanged={this.onDateRangeStartChanged}
                        onRunReport={this.onRunReport}
                    />
                    <div className={`${this.bemBlockName}--report_container`}>
                        {isFetching ? (
                            <p>Loading...</p>
                        ) :
                            this.renderTimeAcitivityReport(reportData)
                        }
                    </div>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        // TODO: Also fetch Products
        const {
            requestCustomers,
            requestEmployees,
            requestTimeActivityDetailsReportData,
        } = this.props;

        requestCustomers();
        requestEmployees();
        requestTimeActivityDetailsReportData();
    }

    private onClickExistingTimeActivity(timeActivity: TimeActivity) {
        const { selectTimeActivity } = this.props;
        selectTimeActivity(timeActivity);
        console.log('Open Modal to start editing the selected Time Activity...');
    }

    private onClickNewTimeActivity() {
        console.log('Open Modal to start making a new Time Activity...');
    }

    private onDateRangeEndChanged(newEndDate: string) {
        const { updateDateRangeEnd } = this.props;
        updateDateRangeEnd(newEndDate);
    }

    private onDateRangeStartChanged(newStartDate: string) {
        const { updateDateRangeStart } = this.props;
        updateDateRangeStart(newStartDate);
    }

    private onRunReport() {
        const {
            requestTimeActivityDetailsReportData,
            resetTimeActivityDetailsReportData,
        } = this.props;

        resetTimeActivityDetailsReportData();
        requestTimeActivityDetailsReportData();
    }

    private displayHhMm(input: any): string {
        if (!moment.isDuration(input)) {
            return '';
        }

        return `${this.pad(input.hours(), 2)}:${this.pad(input.minutes(), 2)}`;
    }

    private pad(num: number, size: number): string  {
        let result = num.toString();

        while (result.length < size) {
            result = `0${result}`;
        }

        return result;
    }

    private renderTimeAcitivityReport(reportData: TimeActivityDetailsReport | null): JSX.Element {
        if (isNil(reportData) || isEmpty(reportData.timeActivities)) {
            return (
                <p>This report does not contain any data.</p>
            );
        }

        const groupedByCustomer = map(
            groupBy(
                reportData.timeActivities,
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
            <table className="table table-hover table-sm report-table">
                <thead>
                    <tr>
                        <th className="col-md-2 bg-white sticky-top sticky-border">Activity Date</th>
                        <th className="col-md-6 bg-white sticky-top sticky-border">Memo/Description</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Duration</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {map(groupedByCustomer, (customerGroup) => {

                        const totalDuration = moment.duration();
                        let totalBillableAmount = 0;

                        return (
                            <React.Fragment key={`cust-${customerGroup.customerNumber}`}>
                                <tr>
                                    <td className="col-md-12" colSpan={5}>
                                        <strong>{customerGroup.customerDisplayName}</strong>
                                    </td>
                                </tr>

                                {map(customerGroup.timeActivities, (timeActivity) => {
                                    totalDuration.add(moment.duration(timeActivity.totalTime));
                                    totalBillableAmount += timeActivity.totalBillableAmount ?? 0;

                                    return (
                                        <tr key = { timeActivity.id }>
                                            <td className="col-md-2">
                                                <LinkButton
                                                    className="btn-link-report-item"
                                                    onClick={() => this.onClickExistingTimeActivity(timeActivity)}
                                                >
                                                    {moment(timeActivity.date).format('L')}
                                                </LinkButton>
                                            </td>
                                            <td className="col-md-6">
                                                <LinkButton
                                                    className="btn-link-report-item"
                                                    onClick={() => this.onClickExistingTimeActivity(timeActivity)}
                                                >
                                                    <span
                                                        dangerouslySetInnerHTML={{ __html: timeActivity?.description?.replace('\r\n', '<br />') ?? '' }}
                                                            style={{ wordWrap: 'break-word' }}
                                                    />
                                                </LinkButton>
                                            </td>
                                            <td className="col-md-2 text-right">
                                                <LinkButton
                                                    className="btn-link-report-item"
                                                    onClick={() => this.onClickExistingTimeActivity(timeActivity)}
                                                    style={{ textAlign: 'right' }}
                                                >
                                                    {this.displayHhMm(moment.duration(timeActivity.totalTime))}
                                                </LinkButton>
                                            </td>
                                            <td className="col-md-2 text-right">
                                                <LinkButton
                                                    className="btn-link-report-item"
                                                    onClick={() => this.onClickExistingTimeActivity(timeActivity)}
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
                                        {this.displayHhMm(totalDuration)}
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
        );
    }
}

export default withRouter(
    connector(TimeActivityDetailsReportPage as any),
);