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
import * as LedgerStore from '../store/Ledger';
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
    resetDirtyEditorState: JournalEntryStore.actionCreators.resetDirtyEditorState,
    resetLedgerReportData: LedgerStore.actionCreators.reset,
    saveNewJournalEntry: JournalEntryStore.actionCreators.saveNewJournalEntry,
    showAlert: SystemNotificationsStore.actionCreators.showAlert,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type AddJournalEntryPageReduxProps = ConnectedProps<typeof connector>;

type AddJournalEntryPageProps = AddJournalEntryPageReduxProps
    & RouteComponentProps;

class AddJournalEntryPage extends React.PureComponent<AddJournalEntryPageProps> {
    private logger: ILogger;
    private bemBlockName: string = 'add_new_journal_entry_page';

    public constructor(props: AddJournalEntryPageProps) {
        super(props);

        this.logger = new Logger('Add Journal Entry Page');

        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
    }

    public componentDidUpdate(prevProps: AddJournalEntryPageProps) {
        const { isSaving: wasSaving } = prevProps;

        const {
            history,
            isSaving,
            savedEntry,
            showAlert,
            resetDirtyEditorState,
            resetLedgerReportData,
        } = this.props;

        if (wasSaving &&
            !isSaving &&
            !isNil(savedEntry)) {
            this.logger.debug('Just finished saving the journal entry.');
            this.logger.debug('Saved Entry has Entry ID:', savedEntry.entryId);
            showAlert('success', `Successfully created Journal Entry ID ${savedEntry.entryId}`, true);
            resetDirtyEditorState();
            resetLedgerReportData();
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
                            <h1>Add Journal Entry</h1>
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
                    <JournalEntryEditor mode={Mode.Add} />
                </TenantBasePage.Content>
            </TenantBasePage>
        );
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

        const { saveNewJournalEntry } = this.props;
        saveNewJournalEntry();
    }
}

export default withRouter(
    connector(AddJournalEntryPage as any),
);