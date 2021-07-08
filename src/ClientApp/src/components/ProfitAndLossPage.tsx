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

const mapStateToProps = (state: ApplicationState) => {
    return {
        dateRangeEnd: state?.profitAndLoss?.dateRangeEnd,
        dateRangeStart: state?.profitAndLoss?.dateRangeStart,
        isFetching: state.profitAndLoss?.isLoading ?? false,
        profitAndLossData: state.profitAndLoss?.reportData ?? null,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    ...ProfitAndLossStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ProfitAndLossPageReduxProps = ConnectedProps<typeof connector>;

type ProfitAndLossPageProps = ProfitAndLossPageReduxProps
    & RouteComponentProps;

class ProfitAndLossPage extends React.PureComponent<ProfitAndLossPageProps> {
    private bemBlockName: string = 'profit_and_loss_page';

    constructor(props: ProfitAndLossPageProps) {
        super(props);

        this.onDateRangeEndChanged = this.onDateRangeEndChanged.bind(this);
        this.onDateRangeStartChanged = this.onDateRangeStartChanged.bind(this);
        this.onRunReport = this.onRunReport.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const {
            dateRangeEnd,
            dateRangeStart,
            history,
            isFetching,
            profitAndLossData,
            selectedTenant,
        } = this.props;

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
                        onDateRangeEndChanged={this.onDateRangeEndChanged}
                        onDateRangeStartChanged={this.onDateRangeStartChanged}
                        onRunReport={this.onRunReport}
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