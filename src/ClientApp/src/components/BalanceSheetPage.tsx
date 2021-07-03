﻿import * as React from 'react';
import {
    Button,
    Col,
    Form,
    Input,
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

        this.onClickRunReport = this.onClickRunReport.bind(this);
        this.onDateRangeEndChanged = this.onDateRangeEndChanged.bind(this);
        this.onDateRangeStartChanged = this.onDateRangeStartChanged.bind(this);
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
                    {/* TODO: Make the Date Range Selection Form a sharable component */}
                    <Form style={{ marginBottom: 22 }}>
                        <Row form>
                            {/* TODO: Add preset ranges select */}
                            <Col md={2}>
                                <Input
                                    id={`${this.bemBlockName}--date_range_start_input`}
                                    name="date_range_start_input"
                                    onChange={this.onDateRangeStartChanged}
                                    type="date"
                                    value={dateRangeStart ?? ''}
                                />
                            </Col>
                            <Col className="align-self-center no-gutters text-center" md={1} style={{ flex: '0 1 22px' }}>
                                to
                            </Col>
                            <Col md={2}>
                                <Input
                                    id={`${this.bemBlockName}--date_range_end_input`}
                                    name="date_range_end_input"
                                    onChange={this.onDateRangeEndChanged}
                                    type="date"
                                    value={dateRangeEnd ?? ''}
                                />
                            </Col>
                            <Col md={2}>
                                <Button
                                    color="success"
                                    id={`${this.bemBlockName}--run_report_button`}
                                    onClick={this.onClickRunReport}
                                >
                                    Run Report
                                </Button>
                            </Col>
                        </Row>
                    </Form>
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

    private onClickRunReport(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();

        const {
            requestBalanceSheetReportData,
            reset,
        } = this.props;

        reset();
        requestBalanceSheetReportData();
    }

    private onDateRangeEndChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateDateRangeEnd } = this.props;
        updateDateRangeEnd(event.currentTarget.value);
    }

    private onDateRangeStartChanged(event: React.FormEvent<HTMLInputElement>) {
        const { updateDateRangeStart } = this.props;
        updateDateRangeStart(event.currentTarget.value);
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