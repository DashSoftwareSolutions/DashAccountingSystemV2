import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Jumbotron } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import JournalEntryEditor from './JournalEntryEditor';
import Mode from '../models/Mode';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
import TenantSubNavigation, { NavigationSection } from './TenantSubNavigation';

interface AddJournalEntryPageReduxProps {
    canSaveJournalEntry: boolean;
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return {
        canSaveJournalEntry: state.journalEntry?.validation.canSave ?? false,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

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

    public render() {
        const {
            canSaveJournalEntry,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage selectedTenant={selectedTenant}>
                <Jumbotron>
                    <h1>Add Journal Entry</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                    <Button
                        color="success"
                        disabled={!canSaveJournalEntry}
                        id={`${this.bemBlockName}--save_button`}
                        onClick={this.onClickSave}
                        style={{ marginRight: 22, width: 88 }}
                    >
                        Save
                    </Button>
                    <Button
                        color="secondary"
                        id={`${this.bemBlockName}--cancel_button`}
                        onClick={this.onClickCancel}
                        style={{ width: 88 }}
                    >
                        Cancel
                    </Button>
                </Jumbotron>
                <TenantSubNavigation activeSection={NavigationSection.Ledger} />
                <JournalEntryEditor mode={Mode.Add} />
            </TenantBasePage>
        );
    }

    private onClickCancel() {
        const { history } = this.props;
        history.push('/ledger');
    }

    private onClickSave() {
        this.logger.debug('Saving the journal entry...');
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(AddJournalEntryPage as any),
);