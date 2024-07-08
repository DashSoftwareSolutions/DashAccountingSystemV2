import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import { DateTime } from 'luxon';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    Link,
    useNavigate,
} from 'react-router-dom';
import { ApplicationState } from '../../../app/store';
import NavigationSection from '../../../app/navigationSection';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import AmountDisplay from '../../../common/components/amountDisplay';
import Loader from '../../../common/components/loader';
import ScrollableContent from '../../../common/components/scrollableContent';
import ReportParametersAndControls from '../../../common/components/reportParametersAndControls';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import {
    Amount,
    AmountType,
    DateRange,
} from '../../../common/models';
import { TransactionStatus } from '../models';
import ledgerActions from './data/ledger.actionCreators';

const logger: ILogger = new Logger('General Ledger Page');
const bemBlockName: string = 'general_ledger_page';

const mapStateToProps = (state: ApplicationState) => ({
    accounts: state.ledger.accounts,
    dateRangeEnd: state.ledger.dateRangeEnd,
    dateRangeStart: state.ledger.dateRangeStart,
    isFetching: state.ledger.isFetching,
    selectedTenant: state.bootstrap.selectedTenant,
});

const mapDispatchToProps = {
    ...ledgerActions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type GeneralLedgerPageReduxProps = ConnectedProps<typeof connector>;

type GeneralLedgerPageProps = GeneralLedgerPageReduxProps;

function GeneralLedgerPage(props: GeneralLedgerPageProps) {
    const {
        accounts,
        dateRangeEnd,
        dateRangeStart,
        isFetching,
        reset,
        requestLedgerReportData,
        selectedTenant,
        updateDateRange,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        history,
        selectedTenant,
    ]);

    useEffect(() => {
        requestLedgerReportData();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickNewJournalEntry = () => {
        navigate('/app/journal-entry/new');
    };

    const onRunReport = (newDateRange: DateRange) => {
        reset();
        updateDateRange(newDateRange);
        requestLedgerReportData();
    };

    return (
        <React.Fragment>
            <TenantSubNavigation activeSection={NavigationSection.Ledger} />

            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={6}>
                        <h1>General Ledger</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col md={6} style={{ textAlign: 'right' }}>
                        <Button color="primary" onClick={onClickNewJournalEntry}>
                            New Journal Entry
                        </Button>
                    </Col>
                </Row>
            </div>

            <div id={`${bemBlockName}--content`}>
                <ScrollableContent>
                    <ReportParametersAndControls
                        bemBlockName={bemBlockName}
                        dateRangeEnd={dateRangeEnd ?? null}
                        dateRangeStart={dateRangeStart ?? null}
                        onRunReport={onRunReport}
                    />

                    <div className={`${bemBlockName}--report_container`}>
                        {isFetching ? (
                            <Loader />
                        ) : (
                            <table className="table table-hover table-sm report-table">
                                <thead>
                                    <tr>
                                        <th className="col-md-1 bg-white sticky-top sticky-border">Date</th>
                                        <th className="col-md-1 bg-white sticky-top sticky-border">Num</th>
                                        <th className="col-md-6 bg-white sticky-top sticky-border">Description</th>
                                        <th className="col-md-2 bg-white sticky-top sticky-border text-end">Amount</th>
                                        <th className="col-md-2 bg-white sticky-top sticky-border text-end">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts?.map((account) => {
                                        const total = account.transactions
                                            .map((tx) => tx.amount.amount ?? 0)
                                            .reduce((sum, next) => sum + next, 0);

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
                                                    <td className="col-md-10 text-end" colSpan={3}>
                                                        <AmountDisplay
                                                            amount={account.startingBalance}
                                                            normalBalanceType={account.normalBalanceType}
                                                        />
                                                    </td>
                                                </tr>
                                                {account.transactions.map((transaction) => {
                                                    const journalEntryViewRoute = `/journal-entry/view/${transaction.entryId}`;

                                                    const checkNumberSuffix = !isNil(transaction.checkNumber) ?
                                                        ` (Check #${transaction.checkNumber})` :
                                                        '';

                                                    const transactionDescription = `${transaction.description}${checkNumberSuffix}`;

                                                    return (
                                                        <tr key={`acct-${account.accountNumber}-entry-${transaction.entryId}`}>
                                                            <td className="col-md-1">
                                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                                    {DateTime.fromISO(transaction.postDate ?? transaction.entryDate).toLocaleString(DateTime.DATE_SHORT)}
                                                                </Link>
                                                            </td>
                                                            <td className="col-md-1">
                                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                                    {transaction.entryId}
                                                                </Link>
                                                            </td>
                                                            <td className="col-md-7" style={{ wordWrap: 'break-word' }}>
                                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                                    {transactionDescription}
                                                                </Link>
                                                                {transaction.status === TransactionStatus.Pending ? (
                                                                    <React.Fragment>
                                                                        {'\u00a0\u00a0\u00a0'}
                                                                        <span className="badge pending-badge">Pending</span>
                                                                    </React.Fragment>
                                                                ) : null}
                                                            </td>
                                                            <td className="col-md-1 text-end">
                                                                <Link className="hoverable-link" to={journalEntryViewRoute}>
                                                                    <AmountDisplay
                                                                        amount={transaction.amount}
                                                                        normalBalanceType={account.normalBalanceType}
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td className="col-md-2 text-end">
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
                                                    <td className="col-md-8 fw-bold" colSpan={3}>
                                                        {`Total for ${account.accountNumber} - ${account.name}`}
                                                    </td>
                                                    <td className="col-md-2 fw-bold text-end">
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
                        )}
                    </div>
                </ScrollableContent>
            </div>
        </React.Fragment>
    );
}

export default connector(GeneralLedgerPage);
