import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { Button } from 'reactstrap';
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

const mapStateToProps = (state: ApplicationState) => {
    return {
        canSaveJournalEntry: state.journalEntry?.validation.canSave ?? false,
        isSaving: state.journalEntry?.isSaving ?? false,
        selectedTenant: state.tenants?.selectedTenant ?? null,
    };
}

const mapDispatchToProps = {
    resetJournalEntryStore: JournalEntryStore.actionCreators.reset,
    saveNewJournalEntry: JournalEntryStore.actionCreators.saveNewJournalEntry,
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
        const { isSaving } = this.props;

        if (wasSaving && !isSaving) {
            this.logger.debug('Just finished saving the journal entry.');
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
                    <h1>Add Journal Entry</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                    <Button
                        color="success"
                        disabled={isSaving || !canSaveJournalEntry}
                        id={`${this.bemBlockName}--save_button`}
                        onClick={this.onClickSave}
                        style={{ marginRight: 22, width: 88 }}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                        color="secondary"
                        id={`${this.bemBlockName}--cancel_button`}
                        onClick={this.onClickCancel}
                        style={{ width: 88 }}
                    >
                        Cancel
                    </Button>
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
            resetJournalEntryStore,
        } = this.props;

        resetJournalEntryStore();
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