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
import JournalEntryEditor from './JournalEntryEditor';
import Mode from '../models/Mode';
import TenantBasePage from './TenantBasePage';
import * as JournalEntryStore from '../store/JournalEntry';
import * as SystemNotificationsStore from '../store/SystemNotifications';

const mapStateToProps = (state: ApplicationState) => {
    return {
        canSaveJournalEntry: state.journalEntry?.validation.canSave ?? false,
        savedEntry: state.journalEntry?.existingEntry ?? null,
        isSaving: state.journalEntry?.isSaving ?? false,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    requestJournalEntry: JournalEntryStore.actionCreators.requestJournalEntry,
    resetDirtyEditorState: JournalEntryStore.actionCreators.resetDirtyEditorState,
    saveNewJournalEntry: JournalEntryStore.actionCreators.saveNewJournalEntry, // TODO: Replace with action creator for Update/PUT
    showAlert: SystemNotificationsStore.actionCreators.showAlert,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type EditJournalEntryPageReduxProps = ConnectedProps<typeof connector>;

type EditJournalEntryPageProps = EditJournalEntryPageReduxProps
    & RouteComponentProps<{ entryId: string }>;

class EditJournalEntryPage extends React.PureComponent<EditJournalEntryPageProps> {
    private logger: ILogger;
    private bemBlockName: string = 'edit_journal_entry_page';

    public constructor(props: EditJournalEntryPageProps) {
        super(props);

        this.logger = new Logger('Edit Journal Entry Page');

        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate(prevProps: EditJournalEntryPageProps) {
        const { isSaving: wasSaving } = prevProps;

        const {
            history,
            isSaving,
            savedEntry,
            showAlert,
            resetDirtyEditorState,
        } = this.props;

        if (wasSaving &&
            !isSaving &&
            !isNil(savedEntry)) {
            this.logger.debug('Just finished saving the journal entry.');
            this.logger.debug('Saved Entry has Entry ID:', savedEntry.entryId);
            showAlert('success', `Successfully created Journal Entry ID ${savedEntry.entryId}`, true);
            resetDirtyEditorState();
            history.push('/ledger');
        }
    }

    public render() {
        const {
            canSaveJournalEntry,
            history,
            isSaving,
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
                            <h1>Edit Journal Entry</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button
                                color="secondary"
                                id={`${this.bemBlockName}--cancel_button`}
                                onClick={this.onClickCancel}
                                style={{ marginRight: 22, width: 88 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                disabled={isSaving || !canSaveJournalEntry}
                                id={`${this.bemBlockName}--save_button`}
                                onClick={this.onClickSave}
                                style={{ width: 88 }}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <JournalEntryEditor mode={Mode.Edit} />
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

    private onClickCancel() {
        const {
            history,
            resetDirtyEditorState,
        } = this.props;

        resetDirtyEditorState();
        history.push('/ledger');
    }

    private onClickSave() {
        this.logger.debug('Saving the journal entry...');

        // TODO: Replace with action creator for Update/PUT
        const { saveNewJournalEntry } = this.props;
        saveNewJournalEntry();
    }
}

export default withRouter(
    connector(EditJournalEntryPage as any),
);