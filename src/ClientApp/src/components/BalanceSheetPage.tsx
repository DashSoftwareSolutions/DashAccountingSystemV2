import * as React from 'react';
import {
    Col,
    Row,
} from 'reactstrap';
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
import BalanceSheetReport from '../models/BalanceSheetReport';
import ReportDateRangeSelector from './ReportDateRangeSelector';
import TenantBasePage from './TenantBasePage';
import * as BalanceSheetStore from '../store/BalanceSheet';

const mapStateToProps = (state: ApplicationState) => {
    return {
        balanceSheet: state.balanceSheet?.reportData ?? null,
        dateRangeEnd: state?.balanceSheet?.dateRangeEnd,
        dateRangeStart: state?.balanceSheet?.dateRangeStart,
        isFetching: state.balanceSheet?.isLoading ?? false,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    ...BalanceSheetStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type BalanceSheetPageReduxProps = ConnectedProps<typeof connector>;

type BalanceSheetPageProps = BalanceSheetPageReduxProps
    & RouteComponentProps;

class BalanceSheetPage extends React.PureComponent<BalanceSheetPageProps> {
    private bemBlockName: string = 'balance_sheet_page';

    constructor(props: BalanceSheetPageProps) {
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
            balanceSheet,
            dateRangeEnd,
            dateRangeStart,
            history,
            isFetching,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.BalanceSheet}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col>
                            <h1>Balance Sheet</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <ReportDateRangeSelector
                        bemBlockName={this.bemBlockName}
                        dateRangeEnd={dateRangeEnd ?? null}
                        dateRangeStart={dateRangeStart ?? null}
                        onDateRangeEndChanged={this.onDateRangeEndChanged}
                        onDateRangeStartChanged={this.onDateRangeStartChanged}
                        onRunReport={this.onRunReport}
                    />
                    <div className={`${this.bemBlockName}--balance_sheet_report_container`}>
                        {isFetching ? (
                            <p>Loading...</p>
                        ) :
                            this.renderLedgerReportTable(balanceSheet)
                        }
                    </div>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        const { requestBalanceSheetReportData } = this.props;
        requestBalanceSheetReportData();
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
            requestBalanceSheetReportData,
            reset,
        } = this.props;

        reset();
        requestBalanceSheetReportData();
    }

    private renderLedgerReportTable(balanceSheet: BalanceSheetReport | null): JSX.Element {
        if (isNil(balanceSheet)) {
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
                        <td className="font-weight-bold" colSpan={2}>ASSETS</td>
                    </tr>
                    {map(balanceSheet.assets, (assetAccount) => ((
                        <tr key={assetAccount.id}>
                            <td className="account-name">
                                {`${assetAccount.accountNumber} - ${assetAccount.name}`}
                            </td>
                            <td className="text-right">
                                <AmountDisplay
                                    amount={assetAccount.balance}
                                    normalBalanceType={AmountType.Debit}
                                />
                            </td>
                        </tr>
                    )))}
                    <tr className="report-total-row">
                        <td>TOTAL ASSETS</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={balanceSheet.totalAssets}
                                normalBalanceType={AmountType.Debit}
                                showCurrency
                            />
                        </td>
                    </tr>
                    <tr className="report-section-header">
                        <td>LIABILITIES</td>
                    </tr>
                    {map(balanceSheet.liabilities, (liabilityAccount) => ((
                        <tr key={liabilityAccount.id}>
                            <td className="account-name">
                                {`${liabilityAccount.accountNumber} - ${liabilityAccount.name}`}
                            </td>
                            <td className="text-right">
                                <AmountDisplay
                                    amount={liabilityAccount.balance}
                                    normalBalanceType={AmountType.Credit}
                                />
                            </td>
                        </tr>
                    )))}
                    <tr className="report-total-row">
                        <td>TOTAL LIABILITIES</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={balanceSheet.totalLiabilities}
                                normalBalanceType={AmountType.Credit}
                                showCurrency
                            />
                        </td>
                    </tr>
                    <tr className="report-section-header">
                        <td colSpan={2}>EQUITY</td>
                    </tr>
                    {map(balanceSheet.equity, (equityAccount) => ((
                        <tr key={equityAccount.id}>
                            <td className="account-name">
                                {`${equityAccount.accountNumber} - ${equityAccount.name}`}
                            </td>
                            <td className="text-right">
                                <AmountDisplay
                                    amount={equityAccount.balance}
                                    normalBalanceType={AmountType.Credit}
                                />
                            </td>
                        </tr>
                    )))}
                    <tr>
                        <td className="account-name">Net Income</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={balanceSheet.netIncome}
                                normalBalanceType={AmountType.Credit}
                            />
                        </td>
                    </tr>
                    <tr className="report-total-row">
                        <td>TOTAL EQUITY</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={balanceSheet.totalEquity}
                                normalBalanceType={AmountType.Credit}
                                showCurrency
                            />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr className="report-grand-total-row">
                        <td>TOTAL LIABILITIES &amp; EQUITY</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={balanceSheet.totalLiabilitiesAndEquity}
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
    connector(BalanceSheetPage as any),
);