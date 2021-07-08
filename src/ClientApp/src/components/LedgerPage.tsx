import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { map, reduce } from 'lodash';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import Amount from '../models/Amount';
import AmountType from '../models/AmountType';
import AmountDisplay from './AmountDisplay';
import LedgerAccount from '../models/LedgerAccount';
import ReportParametersAndControls from './ReportParametersAndControls';
import TenantBasePage from './TenantBasePage';
import TransactionStatus from '../models/TransactionStatus';
import * as LedgerStore from '../store/Ledger';

const mapStateToProps = (state: ApplicationState) => {
    return {
        accounts: state.ledger?.accounts ?? [],
        dateRangeEnd: state?.ledger?.dateRangeEnd,
        dateRangeStart: state?.ledger?.dateRangeStart,
        isFetching: state.ledger?.isLoading ?? false,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    ...LedgerStore.actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type LedgerPageReduxProps = ConnectedProps<typeof connector>;

type LedgerPageProps = LedgerPageReduxProps
    & RouteComponentProps;

class LedgerPage extends React.PureComponent<LedgerPageProps> {
    private bemBlockName: string = 'ledger_page';

    constructor(props: LedgerPageProps) {
        super(props);

        this.onClickNewJournalEntry = this.onClickNewJournalEntry.bind(this);
        this.onDateRangeEndChanged = this.onDateRangeEndChanged.bind(this);
        this.onDateRangeStartChanged = this.onDateRangeStartChanged.bind(this);
        this.onRunReport = this.onRunReport.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const {
            accounts,
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
                            <h1>General Ledger</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button color="primary" onClick={this.onClickNewJournalEntry}>
                                New Journal Entry
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
                    ): 
                        this.renderLedgerReportTable(accounts)
                    }
                    </div>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        const { requestLedgerReportData } = this.props;
        requestLedgerReportData();
    }

    private onClickNewJournalEntry() {
        const { history } = this.props;
        history.push('/journal-entry/new');
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
            requestLedgerReportData,
            reset,
        } = this.props;

        reset();
        requestLedgerReportData();
    }

    private renderLedgerReportTable(accounts: LedgerAccount[]): JSX.Element {
        return (
            <table className="table table-hover table-sm report-table">
                <thead>
                    <tr>
                        <th className="col-md-1 bg-white sticky-top sticky-border">Date</th>
                        <th className="col-md-1 bg-white sticky-top sticky-border">Num</th>
                        <th className="col-md-6 bg-white sticky-top sticky-border">Description</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Amount</th>
                        <th className="col-md-2 bg-white sticky-top sticky-border text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {map(accounts, (account) => {
                        const total = reduce(
                            map(account.transactions, (tx) => tx.amount.amount ?? 0),
                            (sum, next) => sum + next,
                            0,
                        );

                        const totalAmountType = total === 0 ?
                            account.normalBalanceType :
                            (total < 0 ? AmountType.Credit : AmountType.Debit);

                        const totalAmount: Amount = {
                            amount: total,
                            amountType: totalAmountType,
                            assetType: account.assetType,
                        };

                        return (
                            <React.Fragment key={`acct-${account.accountNumber}`}>
                                <tr>
                                    <td className="col-md-12" colSpan={5}>
                                        <strong>{`${account.accountNumber} - ${account.name}`}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-md-2" colSpan={2}>Beginning Balance</td>
                                    <td className="col-md-10 text-right" colSpan={3}>
                                        <AmountDisplay
                                            amount={account.startingBalance}
                                            normalBalanceType={account.normalBalanceType}
                                        />
                                    </td>
                                </tr>
                                {map(account.transactions, (transaction) => {
                                    const journalEntryViewRoute = `/journal-entry/view/${transaction.entryId}`;
                                    return (
                                        <tr key={`acct-${account.accountNumber}-entry-${transaction.entryId}`}>
                                            <td className="col-md-1">
                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                    {moment(transaction.postDate ?? transaction.entryDate).format('L')}
                                                </Link>
                                            </td>
                                            <td className="col-md-1">
                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                    {transaction.entryId}
                                                </Link>
                                            </td>
                                            <td className="col-md-6" style={{ wordWrap: 'break-word' }}>
                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                    {transaction.description}
                                                </Link>
                                                {transaction.status === TransactionStatus.Pending ? (
                                                    <React.Fragment>
                                                        {'\u00a0\u00a0\u00a0'}
                                                        <span className="badge pending-badge">Pending</span>
                                                    </React.Fragment>
                                                ): null}
                                            </td>
                                            <td className="col-md-2 text-right">
                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                    <AmountDisplay
                                                        amount={transaction.amount}
                                                        normalBalanceType={account.normalBalanceType}
                                                    />
                                                </Link>
                                            </td>
                                            <td className="col-md-2 text-right">
                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                    <AmountDisplay
                                                        amount={transaction.updatedBalance}
                                                        normalBalanceType={account.normalBalanceType}
                                                    />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td className="col-md-8 font-weight-bold" colSpan={3}>
                                        {`Total for ${account.accountNumber} - ${account.name}`}
                                    </td>
                                    <td className="col-md-2 font-weight-bold text-right">
                                        <AmountDisplay
                                            amount={totalAmount}
                                            normalBalanceType={account.normalBalanceType}
                                            showCurrency
                                        />
                                    </td>
                                    <td className="col-md-2" />
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
    connector(LedgerPage as any),
);