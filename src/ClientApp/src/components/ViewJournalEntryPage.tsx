import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';
import {
    filter,
    isNil,
    map,
    reduce,
    sortBy,
} from 'lodash';
import moment from 'moment-timezone';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import AmountType from '../models/AmountType';
import TenantBasePage from './TenantBasePage';
import TransactionStatus from '../models/TransactionStatus';
import TransactionStatusLabel from './TransactionStatusLabel';
import * as JournalEntryStore from '../store/JournalEntry';

const mapStateToProps = (state: ApplicationState) => {
    return {
        isFetching: state.journalEntry?.isLoading ?? false,
        journalEntry: state.journalEntry?.existingEntry ?? null,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    requestJournalEntry: JournalEntryStore.actionCreators.requestJournalEntry,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ViewJournalEntryPageReduxProps = ConnectedProps<typeof connector>;

type ViewJournalEntryPageProps = ViewJournalEntryPageReduxProps
    & RouteComponentProps<{ entryId: string }>;

class ViewJournalEntryPage extends React.PureComponent<ViewJournalEntryPageProps> {
    private bemBlockName: string = 'view_journal_entry_page';

    public constructor(props: ViewJournalEntryPageProps) {
        super(props);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const {
            history,
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
                        <Col>
                            <h1>Journal Entry Details</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    {this.renderJournalEntryData()}
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        const {
            match: {
                params: { entryId },
            },
            requestJournalEntry,
        } = this.props;

        const parsedEntryId = parseInt(entryId, 10) || 0;
        requestJournalEntry(parsedEntryId);
    }

    private renderJournalEntryData(): JSX.Element {
        const {
            isFetching,
            journalEntry,
        } = this.props;

        if (isFetching) {
            return (
                <p>{/* TODO: Some spinner or whatever */}Fetching...</p>
            );
        }

        if (isNil(journalEntry)) {
            return (<React.Fragment />);
        }

        const formattEntryDate = moment(journalEntry.entryDate).format('L');
        const formattedPostDate = !isNil(journalEntry.postDate) ? moment(journalEntry.postDate).format('L') : 'N/A';
        const basisDateMoment = moment(journalEntry.postDate ?? journalEntry.entryDate);
        const period = `${basisDateMoment.format('YYYY')} Q${basisDateMoment.format('Q')}`; // TODO: Maybe _someday_ support custom accounting period scheme other than calendar year

        const totalDebits = reduce(
            map(
                filter(
                    journalEntry.accounts,
                    (a) => a?.amount?.amountType === AmountType.Debit,
                ),
                (a) => a?.amount?.amount ?? 0,
            ),
            (sum, next) => sum + next,
            0);

        const totalCredits = reduce(
            map(
                filter(
                    journalEntry.accounts,
                    (a) => a?.amount?.amountType === AmountType.Credit,
                ),
                (a) => (a?.amount?.amount ?? 0) * -1,
            ),
            (sum, next) => sum + next,
            0);

        return (
            <React.Fragment>
                <ListGroup>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Transaction #</strong></Col>
                            <Col md={4}>{journalEntry.entryId}</Col>
                            <Col md={2}><strong>Check #</strong></Col>
                            <Col md={4}>{journalEntry.checkNumber?.toString() ?? 'N/A'}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Entry Date</strong></Col>
                            <Col md={4}>{formattEntryDate}</Col>
                            <Col md={2}><strong>Post Date</strong></Col>
                            <Col md={4}>{formattedPostDate}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2} style={{ paddingTop: 4 }}><strong>Status</strong></Col>
                            <Col md={4}>
                                <TransactionStatusLabel status={journalEntry.status ?? TransactionStatus.Pending} />
                            </Col>
                            <Col md={2}><strong>Period</strong></Col>
                            <Col md={4}>{period}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Description</strong></Col>
                            <Col md={10}>{journalEntry.description}</Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Note</strong></Col>
                            <Col md={10}>{journalEntry.note ?? 'N/A'}</Col>
                        </Row>
                    </ListGroupItem>
                </ListGroup>
                <table className="table" id={`${this.bemBlockName}--accounts_table`}>
                    <thead>
                        <tr>
                            <th className="col-md-6">Account</th>
                            <th className="col-md-2">Asset Type</th>
                            <th className="col-md-2" style={{ textAlign: 'right' }}>Debit</th>
                            <th className="col-md-2" style={{ textAlign: 'right' }}>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {map(
                            sortBy(
                                journalEntry.accounts,
                                (a) => a?.amount?.amountType === AmountType.Debit ? 1 : 2,
                                (a) => a?.accountNumber,
                            ),
                            (account) => {
                                const {
                                    accountId,
                                    accountName,
                                    accountNumber,
                                    amount: amountObject
                                } = account;

                                const {
                                    amount,
                                    amountType,
                                    assetType
                                } = amountObject ?? {};

                                const assetTypeName = assetType?.name ?? '';

                                const creditAmount = !isNil(amount) && amountType === AmountType.Credit ?
                                    -1 * amount ?? 0 :
                                    null;

                                const debitAmount = !isNil(amount) && amountType === AmountType.Debit ?
                                    amount ?? 0 :
                                    null;

                                const safeAccountId = accountId ?? '';

                                return (
                                    <tr key={safeAccountId}>
                                        <td>{`${accountNumber} - ${accountName}`}</td>
                                        <td>{assetTypeName}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {/* TODO/FIXME: Be aware of asset type and user locale */}
                                            {!isNil(debitAmount) ? debitAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }) : ''}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {/* TODO/FIXME: Be aware of asset type and user locale */}
                                            {!isNil(creditAmount) ? creditAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }) : ''}
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="col-md-6">
                                <strong>TOTALS</strong>
                            </td>
                            <td className="col-md-2" />
                            <td className="col-md-2" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                {/* TODO/FIXME: Be aware of asset type and user locale */}
                                {totalDebits.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                            </td>
                            <td className="col-md-2" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                {/* TODO/FIXME: Be aware of asset type and user locale */}
                                {totalCredits.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </React.Fragment>
        );
    }
}

export default withRouter(
    connector(ViewJournalEntryPage as any),
);