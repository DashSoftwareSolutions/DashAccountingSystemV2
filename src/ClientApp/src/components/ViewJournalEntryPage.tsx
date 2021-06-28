import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { isNil } from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import Mode from '../models/Mode';
import TenantBasePage from './TenantBasePage';
import TransactionStatus from '../models/TransactionStatus';
import TransactionStatusLabel from './TransactionStatusLabel';
import * as JournalEntryStore from '../store/JournalEntry';
import * as SystemNotificationsStore from '../store/SystemNotifications';

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
            isFetching,
            journalEntry,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Ledger}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <h1>Journal Entry Details</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    {isFetching ? (
                        <p>{/* TODO: Some spinner or whatever */}Fetching...</p>
                    ) : (
                        <div className="list-group meta-data-table">
                            {/* TODO: Consider using ReactStrap components...??? */}
                            <div className="list-group-item row">
                                <div className="col-xs-3 col-md-2"><strong>Transaction #</strong></div>
                                <div className="col-xs-3 col-md-4">{journalEntry?.entryId}</div>
                                <div className="col-xs-3 col-md-2"><strong>Check #</strong></div>
                                <div className="col-xs-3 col-md-4">{journalEntry?.checkNumber?.toString() ?? 'N/A'}</div>
                            </div>
                            <div className="list-group-item row">
                                <div className="col-xs-3 col-md-2"><strong>Entry Date</strong></div>
                                <div className="col-xs-3 col-md-4">{journalEntry?.entryDate}</div>
                                <div className="col-xs-3 col-md-2"><strong>Post Date</strong></div>
                                <div className="col-xs-3 col-md-4">{journalEntry?.postDate ?? 'N/A'}</div>
                            </div>
                            <div className="list-group-item row">
                                <div className="col-xs-3 col-md-2"><strong>Status</strong></div>
                                <div className="col-xs-3 col-md-10">
                                    <TransactionStatusLabel status={journalEntry?.status ?? TransactionStatus.Pending} />
                                </div>
                            </div>
                            <div className="list-group-item row">
                                <div className="col-md-2"><strong>Description</strong></div>
                                <div className="col-md-10">{journalEntry?.description}</div>
                            </div>
                            <div className="list-group-item row">
                                <div className="col-md-2"><strong>Note</strong></div>
                                <div className="col-md-10">{journalEntry?.note ?? 'N/A'}</div>
                            </div>
                        </div>
                    )}
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
}

export default withRouter(
    connector(ViewJournalEntryPage as any),
);