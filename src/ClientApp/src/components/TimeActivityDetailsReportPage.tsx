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
    isNil,
    map,
} from 'lodash';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import AmountType from '../models/AmountType';
import AmountDisplay from './AmountDisplay';
import ReportParametersAndControls from './ReportParametersAndControls'; // TODO: Use this initially but neeed one w/ Empliyee and Customer filters
import TenantBasePage from './TenantBasePage';
import TimeActivity from '../models/TimeActivity';
import TimeActivityDetailsReport from '../models/TimeActivityDetailsReport';
import * as TimeActivityStore from '../store/TimeActivity';
import AssetType from '../models/AssetType';

const mapStateToProps = (state: ApplicationState) => {
    return {
        reportData: state?.timeActivity?.detailsReportData ?? null,
        dateRangeEnd: state?.timeActivity?.dateRangeEnd,
        dateRangeStart: state?.timeActivity?.dateRangeStart,
        // TODO: Customer and Employee Filters
        isFetching: state.timeActivity?.isLoading ?? false,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
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
            isFetching,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Ledger}
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
        // TODO: Also fetch Customers, Employees, and Products
        const { requestTimeActivityDetailsReportData } = this.props;
        requestTimeActivityDetailsReportData();
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

    private renderTimeAcitivityReport(reportData: TimeActivityDetailsReport | null): JSX.Element {
        if (isNil(reportData)) {
            return (
                <p>No data</p>
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

        console.log('groupedData:', groupedByCustomer);

        // TODO: Handle no data

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

                        return (
                            <React.Fragment key={`cust-${customerGroup.customerNumber}`}>
                                <tr>
                                    <td className="col-md-12" colSpan={5}>
                                        <strong>{customerGroup.customerDisplayName}</strong>
                                    </td>
                                </tr>
                                {map(customerGroup.timeActivities, (timeActivity) => ((
                                    <tr key={timeActivity.id}>
                                        <td className="col-md-2">{moment(timeActivity.date).format('L')}</td>
                                        <td
                                            className="col-md-6"
                                            dangerouslySetInnerHTML={{ __html: timeActivity?.description?.replace('\r\n', '<br />') ?? '' }}
                                            style={{ wordWrap: 'break-word' }}
                                        />
                                        <td className="col-md-2 text-right">
                                            {timeActivity.totalTime}
                                        </td>
                                        <td className="col-md-2 text-right">
                                            <AmountDisplay
                                                amount={{
                                                    amount: timeActivity.totalBillableAmount,
                                                    amountType: AmountType.Debit,
                                                    assetType: reportData.defaultAssetType,
                                                }}
                                                showCurrency={false}
                                            />
                                            
                                        </td>
                                    </tr>
                                )))}
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