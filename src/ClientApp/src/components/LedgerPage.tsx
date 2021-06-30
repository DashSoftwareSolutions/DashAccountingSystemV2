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
import LedgerAccount from '../models/LedgerAccount';
import TenantBasePage from './TenantBasePage';
import TransactionStatus from '../models/TransactionStatus';
import * as LedgerStore from '../store/Ledger';

const mapStateToProps = (state: ApplicationState) => {
    return {
        accounts: state.ledger?.accounts ?? [],
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
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const {
            accounts,
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
                    {isFetching ? (
                        <p>Loading...</p>
                    ): 
                        this.renderLedgerReportTable(accounts)
                    }
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

    private renderLedgerReportTable(accounts: LedgerAccount[]): JSX.Element {
        return (
            <div className="table">
                <table className="table table-sm" style={{ fontSize: '0.9em', width: '100%' }}>
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
                            let total = reduce(
                                map(account.transactions, (tx) => tx.amount.amount ?? 0),
                                (sum, next) => sum + next,
                                0,
                            );

                            // TODO: Adjust total for positive/negative, depending on normal balance type

                            // TODO: Adjust all displayed amounts for positive/negative, depending on normal balance type
                            // We probably want a component for this! :-)
                            const accountNormalBalanceType = account.normalBalanceType;
                            const startingBalanceType = account.startingBalance.amountType;
                            const isStartingBalanceNormal = startingBalanceType === accountNormalBalanceType;

                            return (
                                <React.Fragment key={`acct-${account.accountNumber}`}>
                                    <tr>
                                        <td className="col-md-12" colSpan={5}>
                                            <strong>{`${account.accountNumber} - ${account.name}`}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-md-2" colSpan={2}>Beginning Balance</td>
                                        <td className="col-md-10" colSpan={3} style={{ textAlign: 'right' }}>
                                            {/* TODO/FIXME: Be aware of asset type and user locale */}
                                            {Math.abs(account.startingBalance.amount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                                                    {/* TODO: Badge for Pending Transactions - sort of like Pending Comments on GitHub PRs ;-) */}
                                                </td>
                                                <td className="col-md-2" style={{ textAlign: 'right' }}>
                                                    <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                        {(transaction.amount.amount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </Link>
                                                </td>
                                                <td className="col-md-2" style={{ textAlign: 'right' }}>
                                                    <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                        {(transaction.updatedBalance.amount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr>
                                        <td className="col-md-8" colSpan={3}>
                                            <strong>
                                                {`Total for ${account.accountNumber} - ${account.name}`}
                                            </strong>
                                        </td>
                                        <td className="col-md-2" style={{ textAlign: 'right' }}>
                                            <strong>
                                                {total.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                                            </strong>
                                        </td>
                                        <td className="col-md-2" />
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withRouter(
    connector(LedgerPage as any),
);