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
    isEmpty,
    isNil,
    map,
    reduce,
    sortBy,
    trim,
} from 'lodash';
import moment from 'moment-timezone';
import { RouteComponentProps, withRouter } from 'react-router';
import { DEFAULT_ASSET_TYPE } from '../common/Constants';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import Amount from '../models/Amount';
import AmountDisplay from './AmountDisplay';
import AmountType from '../models/AmountType';
import PostJournalEntryModalDialog from './PostJournalEntryModalDialog';
import TenantBasePage from './TenantBasePage';
import TransactionStatus from '../models/TransactionStatus';
import TransactionStatusLabel from './TransactionStatusLabel';
import * as JournalEntryStore from '../store/JournalEntry';
import * as LedgerStore from '../store/Ledger';
import * as SystemNotificationsStore from '../store/SystemNotifications';

const mapStateToProps = (state: ApplicationState) => {
    return {
        isFetching: state.journalEntry?.isLoading ?? false,
        isSaving: state.journalEntry?.isSaving ?? false,
        journalEntry: state.journalEntry?.existingEntry ?? null,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    editJournalEntry: JournalEntryStore.actionCreators.editJournalEntry,
    requestJournalEntry: JournalEntryStore.actionCreators.requestJournalEntry,
    resetDirtyEditorState: JournalEntryStore.actionCreators.resetDirtyEditorState,
    resetLedgerReportData: LedgerStore.actionCreators.reset,
    showAlert: SystemNotificationsStore.actionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ViewJournalEntryPageReduxProps = ConnectedProps<typeof connector>;

type ViewJournalEntryPageProps = ViewJournalEntryPageReduxProps
    & RouteComponentProps<{ entryId: string }>;

interface ViewJournalEntryPageState {
    isPostModalOpen: boolean;
}

class ViewJournalEntryPage extends React.PureComponent<ViewJournalEntryPageProps, ViewJournalEntryPageState> {
    private bemBlockName: string = 'view_journal_entry_page';
    private logger: ILogger;

    public constructor(props: ViewJournalEntryPageProps) {
        super(props);

        this.logger = new Logger('View Journal Entry Page');

        this.state = { isPostModalOpen: false };

        this.onClickBack = this.onClickBack.bind(this);
        this.onClickEditJournalEntry = this.onClickEditJournalEntry.bind(this);
        this.onClickPostJournalEntry = this.onClickPostJournalEntry.bind(this);
        this.onClosePostEntryDialog = this.onClosePostEntryDialog.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate(prevProps: ViewJournalEntryPageProps) {
        const { isSaving: wasSaving } = prevProps;

        const {
            isSaving,
            journalEntry,
            showAlert,
            resetDirtyEditorState,
            resetLedgerReportData,
        } = this.props;

        if (wasSaving &&
            !isSaving &&
            !isNil(journalEntry)) {
            this.logger.debug('Just finished posting the journal entry.');
            showAlert('success', `Successfully posted Journal Entry ID ${journalEntry.entryId}`, true);
            resetDirtyEditorState();
            resetLedgerReportData();
            this.setState({ isPostModalOpen: false });
        }
    }

    public render() {
        const {
            history,
            journalEntry,
            selectedTenant,
        } = this.props;

        const { isPostModalOpen } = this.state;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Ledger}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col md={6}>
                            <h1>Journal Entry Details</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button
                                color="secondary"
                                id={`${this.bemBlockName}--back_button`}
                                onClick={this.onClickBack}
                                style={{ marginRight: 22, width: 110 }}
                            >
                                Back
                            </Button>

                            <Button
                                color="success"
                                disabled={journalEntry?.status !== TransactionStatus.Pending}
                                id={`${this.bemBlockName}--post_entry_button`}
                                onClick={this.onClickPostJournalEntry}
                                style={{ marginRight: 22, width: 110 }}
                            >
                                Post Entry
                            </Button>

                            <Button
                                color="primary"
                                id={`${this.bemBlockName}--edit_entry_button`}
                                onClick={this.onClickEditJournalEntry}
                                style={{ width: 110 }}
                            >
                                Edit Entry
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    {this.renderJournalEntryData()}

                    <PostJournalEntryModalDialog
                        isOpen={isPostModalOpen}
                        onClose={this.onClosePostEntryDialog}
                    />
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

    private onClickBack() {
        const { history } = this.props;
        history.goBack();
    }

    private onClickEditJournalEntry() {
        const {
            editJournalEntry,
            journalEntry,
            history,
        } = this.props;

        editJournalEntry();
        history.push(`/journal-entry/edit/${journalEntry?.entryId}`);
    }

    private onClickPostJournalEntry() {
        console.log('Open up modal to post a pending journal entry...');
        const { editJournalEntry } = this.props;
        editJournalEntry();
        this.setState({ isPostModalOpen: true });
    }

    private onClosePostEntryDialog(event: React.MouseEvent<any> | React.KeyboardEvent<any>) {
        this.setState({ isPostModalOpen: false });
    }

    private renderJournalEntryData(): JSX.Element {
        const {
            isFetching,
            journalEntry,
        } = this.props;

        if (isFetching) {
            return (
                <p>{/* TODO: Some spinner or whatever */}Loading...</p>
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

        const defaultAssetType = !isEmpty(journalEntry.accounts) ?
            journalEntry.accounts[0]?.amount?.assetType ?? DEFAULT_ASSET_TYPE :
            DEFAULT_ASSET_TYPE;

        const totalDebitsAmount: Amount = {
            amount: totalDebits,
            amountType: AmountType.Debit,
            assetType: defaultAssetType,
        };

        const totalCreditsAmount: Amount = {
            amount: totalCredits,
            amountType: AmountType.Credit,
            assetType: defaultAssetType,
        };

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
                                    amount
                                } = account;

                                if (isNil(amount)) {
                                    return null;
                                }


                                const assetTypeName = trim(`${amount.assetType?.name ?? ''} ${amount.assetType?.symbol ?? ''}`);

                                const safeAccountId = accountId ?? '';

                                return (
                                    <tr key={safeAccountId}>
                                        <td>{`${accountNumber} - ${accountName}`}</td>
                                        <td>{assetTypeName}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {
                                                amount.amountType === AmountType.Debit ? (
                                                    <AmountDisplay
                                                        amount={amount}
                                                        showCurrency
                                                    />
                                                ) : null
                                            }
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {
                                               amount.amountType === AmountType.Credit ? (
                                                    <AmountDisplay
                                                        amount={amount}
                                                        showCurrency
                                                    />
                                                ) : null
                                            }
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
                            <td className="col-md-2 font-weight-bold text-right">
                                <AmountDisplay
                                    amount={totalDebitsAmount}
                                    showCurrency
                                />
                            </td>
                            <td className="col-md-2" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                <AmountDisplay
                                    amount={totalCreditsAmount}
                                    showCurrency
                                />
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