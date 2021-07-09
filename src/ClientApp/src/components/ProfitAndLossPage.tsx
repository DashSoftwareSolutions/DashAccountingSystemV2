import * as React from 'react';
import { Col, Row } from 'reactstrap';
import { ConnectedProps, connect } from 'react-redux';
import {
    isNil,
    map,
} from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import AmountType from '../models/AmountType';
import AmountDisplay from './AmountDisplay';
import ProfitAndLossReport from '../models/ProfitAndLossReport';
import ReportParametersAndControls from './ReportParametersAndControls';
import TenantBasePage from './TenantBasePage';
import * as ProfitAndLossStore from '../store/ProfitAndLoss';
import * as SystemNotificationsStore from '../store/SystemNotifications';

const mapStateToProps = (state: ApplicationState) => {
    return {
        dateRangeEnd: state?.profitAndLoss?.dateRangeEnd,
        dateRangeStart: state?.profitAndLoss?.dateRangeStart,
        excelDownloadError: state?.exportDownload?.error ?? null,
        excelDownloadInfo: state?.exportDownload?.downloadInfo ?? null,
        isDownloading: state?.exportDownload?.isLoading ?? false,
        isFetching: state.profitAndLoss?.isLoading ?? false,
        profitAndLossData: state.profitAndLoss?.reportData ?? null,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    ...ProfitAndLossStore.actionCreators,
    showAlert: SystemNotificationsStore.actionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ProfitAndLossPageReduxProps = ConnectedProps<typeof connector>;

type ProfitAndLossPageProps = ProfitAndLossPageReduxProps
    & RouteComponentProps;

interface ProfitAndLossPageState {
    isDownloadInProgress: boolean;
}

class ProfitAndLossPage extends React.PureComponent<ProfitAndLossPageProps, ProfitAndLossPageState> {
    private bemBlockName: string = 'profit_and_loss_page';

    constructor(props: ProfitAndLossPageProps) {
        super(props);

        this.state = { isDownloadInProgress: false };

        this.onDateRangeEndChanged = this.onDateRangeEndChanged.bind(this);
        this.onDateRangeStartChanged = this.onDateRangeStartChanged.bind(this);
        this.onDownloadExcel = this.onDownloadExcel.bind(this);
        this.onRunReport = this.onRunReport.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate(prevProps: ProfitAndLossPageProps) {
        const { isDownloading: wasDownloading } = prevProps;

        const {
            excelDownloadError,
            excelDownloadInfo,
            isDownloading,
            showAlert,
        } = this.props;

        if (wasDownloading && !isDownloading) {
            if (!isNil(excelDownloadError)) {
                showAlert('danger', 'Error exporting Balance Sheet Report to Excel', true);
            } else if (!isNil(excelDownloadInfo)) {
                window.location.href = `${window.location.origin}/api/export-download?filename=${excelDownloadInfo.fileName}&format=${excelDownloadInfo.format}&token=${excelDownloadInfo.token}`;
            }

            setTimeout(() => { this.setState({ isDownloadInProgress: false }); }, 750); // delay clearing `isDownloadInProgress` flag until save download window pops open
        }
    }

    public render() {
        const {
            dateRangeEnd,
            dateRangeStart,
            history,
            isDownloading,
            isFetching,
            profitAndLossData,
            selectedTenant,
        } = this.props;

        const {
            isDownloadInProgress,
        } = this.state;

        const isDownloadingAuthoritative = isDownloading || isDownloadInProgress;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.ProfitAndLoss}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col>
                            <h1>Profit &amp; Loss</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <ReportParametersAndControls
                        bemBlockName={this.bemBlockName}
                        dateRangeEnd={dateRangeEnd ?? null}
                        dateRangeStart={dateRangeStart ?? null}
                        isRequestingExcelDownload={isDownloadingAuthoritative}
                        onDateRangeEndChanged={this.onDateRangeEndChanged}
                        onDateRangeStartChanged={this.onDateRangeStartChanged}
                        onDownloadExcel={this.onDownloadExcel}
                        onRunReport={this.onRunReport}
                        showDownloadExcelButton
                    />
                    <div className={`${this.bemBlockName}--report_container`}>
                        {isFetching ? (
                            <p>Loading...</p>
                        ) :
                            this.renderProfitAndLossReportTable(profitAndLossData)
                        }
                    </div>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        const { requestProfitAndLossReportData } = this.props;
        requestProfitAndLossReportData();
    }

    private onDateRangeEndChanged(newEndDate: string) {
        const { updateDateRangeEnd } = this.props;
        updateDateRangeEnd(newEndDate);
    }

    private onDateRangeStartChanged(newStartDate: string) {
        const { updateDateRangeStart } = this.props;
        updateDateRangeStart(newStartDate);
    }

    private onDownloadExcel() {
        const { requestProfitAndLossReportExcelExport } = this.props;
        requestProfitAndLossReportExcelExport();
        this.setState({ isDownloadInProgress: true });
    }

    private onRunReport() {
        const {
            requestProfitAndLossReportData,
            reset,
        } = this.props;

        reset();
        requestProfitAndLossReportData();
    }

    private renderProfitAndLossReportTable(profitAndLossData: ProfitAndLossReport | null): JSX.Element {
        if (isNil(profitAndLossData)) {
            return (
                <p>No data</p>
            );
        }

        return (
            <table className="table table-hover table-sm report-table">
                <thead>
                    <tr>
                        <th className="col-md-10 bg-white sticky-top sticky-border" />
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="font-weight-bold" colSpan={2}>OPERATING INCOME</td>
                    </tr>
                    {map(profitAndLossData.operatingIncome, (opIncomeAccount) => ((
                        <tr key={opIncomeAccount.id}>
                            <td className="account-name">
                                {`${opIncomeAccount.accountNumber} - ${opIncomeAccount.name}`}
                            </td>
                            <td className="text-right">
                                <AmountDisplay
                                    amount={opIncomeAccount.balance}
                                    normalBalanceType={AmountType.Credit}
                                />
                            </td>
                        </tr>
                    )))}
                    <tr className="report-total-row">
                        <td>GROSS PROFIT</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={profitAndLossData.grossProfit}
                                normalBalanceType={AmountType.Credit}
                                showCurrency
                            />
                        </td>
                    </tr>
                    <tr className="report-section-header">
                        <td>OPERATING EXPENSES</td>
                    </tr>
                    {map(profitAndLossData.operatingExpenses, (opExpenseAccount) => ((
                        <tr key={opExpenseAccount.id}>
                            <td className="account-name">
                                {`${opExpenseAccount.accountNumber} - ${opExpenseAccount.name}`}
                            </td>
                            <td className="text-right">
                                <AmountDisplay
                                    amount={opExpenseAccount.balance}
                                    normalBalanceType={AmountType.Debit}
                                />
                            </td>
                        </tr>
                    )))}
                    <tr className="report-total-row">
                        <td>TOTAL OPERATING EXPENSES</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={profitAndLossData.totalOperatingExpenses}
                                normalBalanceType={AmountType.Debit}
                                showCurrency
                            />
                        </td>
                    </tr>
                    <tr className="report-grand-total-row">
                        <td>NET OPERATING INCOME</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={profitAndLossData.netOperatingIncome}
                                normalBalanceType={AmountType.Credit}
                                showCurrency
                            />
                        </td>
                    </tr>
                    <tr className="report-section-header">
                        <td className="font-weight-bold" colSpan={2}>OTHER INCOME</td>
                    </tr>
                    {map(profitAndLossData.otherIncome, (otherIncomeAccount) => ((
                        <tr key={otherIncomeAccount.id}>
                            <td className="account-name">
                                {`${otherIncomeAccount.accountNumber} - ${otherIncomeAccount.name}`}
                            </td>
                            <td className="text-right">
                                <AmountDisplay
                                    amount={otherIncomeAccount.balance}
                                    normalBalanceType={AmountType.Credit}
                                />
                            </td>
                        </tr>
                    )))}
                    <tr className="report-total-row">
                        <td>TOTAL OTHER INCOME</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={profitAndLossData.totalOtherIncome}
                                normalBalanceType={AmountType.Credit}
                                showCurrency
                            />
                        </td>
                    </tr>
                    <tr className="report-section-header">
                        <td>OTHER EXPENSES</td>
                    </tr>
                    {map(profitAndLossData.otherExpenses, (otherExpenseAccount) => ((
                        <tr key={otherExpenseAccount.id}>
                            <td className="account-name">
                                {`${otherExpenseAccount.accountNumber} - ${otherExpenseAccount.name}`}
                            </td>
                            <td className="text-right">
                                <AmountDisplay
                                    amount={otherExpenseAccount.balance}
                                    normalBalanceType={AmountType.Debit}
                                />
                            </td>
                        </tr>
                    )))}
                    <tr className="report-total-row">
                        <td>TOTAL OTHER EXPENSES</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={profitAndLossData.totalOtherExpenses}
                                normalBalanceType={AmountType.Debit}
                                showCurrency
                            />
                        </td>
                    </tr>
                    <tr className="report-grand-total-row">
                        <td>NET OTHER INCOME</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={profitAndLossData.netOtherIncome}
                                normalBalanceType={AmountType.Credit}
                                showCurrency
                            />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="report-grand-total-row">
                        <td>NET INCOME</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={profitAndLossData.netIncome}
                                normalBalanceType={AmountType.Credit}
                                showCurrency
                            />
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}

export default withRouter(
    connector(ProfitAndLossPage as any),
);