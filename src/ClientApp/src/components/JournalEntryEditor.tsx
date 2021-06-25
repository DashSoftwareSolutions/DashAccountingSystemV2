import * as React from 'react';
import { ApplicationState } from '../store';
import { ConnectedProps, connect } from 'react-redux';
import { isFinite, isNil } from 'lodash';
import {
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback,
    FormText,
    Row,
} from 'reactstrap';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import Account from '../models/Account';
import AssetType from '../models/AssetType';
import Mode from '../models/Mode';
import Tenant from '../models/Tenant';
import AccountSelector from './AccountSelector';
import * as AccountsStore from '../store/Accounts';
import * as JournalEntryStore from '../store/JournalEntry';
import * as LookupValuesStore from '../store/LookupValues';
import AccountSelectOption from '../models/AccountSelectOption';

interface JournalEntryEditorOwnProps {
    mode: Mode;
}

const mapStateToProps = (state: ApplicationState, props: JournalEntryEditorOwnProps) => {
    return {
        accounts: state.accounts?.accounts,
        accountSelectOptions: state.accounts?.accountSelectOptions,
        assetTypes: state.lookups?.assetTypes,
        journalEntry: state.journalEntry,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

const mapDispatchToProps = {
    ...JournalEntryStore.actionCreators,
    requestAccounts: AccountsStore.actionCreators.requestAccounts,
    requestLookupValues: LookupValuesStore.actionCreators.requestLookupValues,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type JournalEntryEditorReduxProps = ConnectedProps<typeof connector>;

type JournalEntryEditorProps = JournalEntryEditorOwnProps
    & JournalEntryEditorReduxProps;

interface JournalEntryAccountsValidationState {
    error: string | null;
    hasSufficientAccounts: boolean;
    isBalanced: boolean;
}

interface JournalEntryAttributeValidationState {
    valid: boolean | undefined;
    invalid: boolean | undefined;
    error: string | null;
}

const DEFAULT_ATTRIBUTE_VALIDATION_STATE: JournalEntryAttributeValidationState = {
    error: null,
    valid: undefined,
    invalid: undefined,
};

interface JournalEntryEditorState {
    accountValidation: JournalEntryAccountsValidationState;
    attributeValidation: Map<string, JournalEntryAttributeValidationState>;

    // TEMP FOR TESTING
    selectedAccountId: string | null; // GUID - ID of selected account
}

class JournalEntryEditor extends React.PureComponent<JournalEntryEditorProps, JournalEntryEditorState> {
    private logger: ILogger;
    private bemBlockName: string = 'journal_entry_editor';

    public constructor(props: JournalEntryEditorProps) {
        super(props);

        this.logger = new Logger('Journal Entry Editor');

        this.state = {
            accountValidation: {
                error: '',
                hasSufficientAccounts: false,
                isBalanced: true,
            },
            attributeValidation: new Map([
                ['entryDate', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
                ['postDate', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
                ['description', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
                ['note', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
                ['checkNumber', { ...DEFAULT_ATTRIBUTE_VALIDATION_STATE }],
            ]),
            selectedAccountId: null,
        };

        this.onCheckNumberChanged = this.onCheckNumberChanged.bind(this);
        this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
        this.onEntryDateChanged = this.onEntryDateChanged.bind(this);
        this.onNoteChanged = this.onNoteChanged.bind(this);
        this.onPostDateChanged = this.onPostDateChanged.bind(this);

        // TEMP FOR TESTING
        this.onAccountSelectorChange = this.onAccountSelectorChange.bind(this);
    }

    public componentDidMount() {
        const {
            mode,
            initializeNewJournalEntry,
        } = this.props;

        if (mode === Mode.Add) {
            initializeNewJournalEntry();
        }

        this.ensureDataFetched();
    }

    public render() {
        const {
            accountSelectOptions,
            journalEntry,
        } = this.props;

        const { dirtyEntry } = journalEntry ?? {};

        if (isNil(dirtyEntry)) {
            this.logger.warn('No journal entry was found in Redux state');
            return null;
        }

        const {
            attributeValidation,
            selectedAccountId,
        } = this.state;

        return (
            <React.Fragment>
                <Form style={{ marginTop: 22 }}>
                    <Row form>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--entry_date_input`}>Entry Date</Label>
                                <Input
                                    id={`${this.bemBlockName}--entry_date_input`}
                                    invalid={attributeValidation.get('entryDate')?.invalid}
                                    name="entry_date_input"
                                    onChange={this.onEntryDateChanged}
                                    type="date"
                                    valid={attributeValidation.get('entryDate')?.valid}
                                    value={dirtyEntry.entryDate ?? ''}
                                />
                                <FormFeedback>{attributeValidation.get('entryDate')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--post_date_input`}>Post Date</Label>
                                <Input
                                    id={`${this.bemBlockName}--post_date_input`}
                                    invalid={attributeValidation.get('postDate')?.invalid}
                                    name="post_date_input"
                                    onChange={this.onPostDateChanged}
                                    type="date"
                                    valid={attributeValidation.get('postDate')?.valid}
                                    value={dirtyEntry.postDate ?? ''}
                                />
                                <FormFeedback>{attributeValidation.get('postDate')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--check_number_input`}>Check Number</Label>
                                <Input
                                    id={`${this.bemBlockName}--check_number_input`}
                                    invalid={attributeValidation.get('checkNumber')?.invalid}
                                    name="check_number_input"
                                    onChange={this.onCheckNumberChanged}
                                    placeholder="check # reference (if applicable)"
                                    type="number"
                                    valid={attributeValidation.get('checkNumber')?.valid}
                                    value={dirtyEntry.checkNumber?.toString() ?? ''}
                                />
                                <FormFeedback>{attributeValidation.get('checkNumber')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--description_textarea`}>Transaction Description</Label>
                                <Input
                                    id={`${this.bemBlockName}--description_textarea`}
                                    invalid={attributeValidation.get('description')?.invalid}
                                    maxLength={2048}
                                    name="description_textarea"
                                    onChange={this.onDescriptionChanged}
                                    placeholder="Description of transaction that will appear on all impacted accounts"
                                    rows={3}
                                    style={{ resize: 'none' }}
                                    type="textarea"
                                    valid={attributeValidation.get('description')?.valid}
                                    value={dirtyEntry.description ?? ''}
                                />
                                <FormFeedback>{attributeValidation.get('description')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--note_textarea`}>Additional Note</Label>
                                <Input
                                    id={`${this.bemBlockName}--note_textarea`}
                                    invalid={attributeValidation.get('note')?.invalid}
                                    name="note_textarea"
                                    placeholder="Optional additional note on the transaction"
                                    onChange={this.onNoteChanged}
                                    rows={3}
                                    style={{ resize: 'none' }}
                                    type="textarea"
                                    valid={attributeValidation.get('note')?.valid}
                                    value={dirtyEntry.note ?? ''}
                                />
                                <FormFeedback>{attributeValidation.get('note')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            {/* TEMP FOR TESTING */}
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--account_selector`}>Account Selector</Label>
                                <AccountSelector
                                    accountSelectOptions={accountSelectOptions ?? []}
                                    disabledAccountIds={[]}
                                    id={`${this.bemBlockName}--account_selector`}
                                    name="account_selector"
                                    onChange={this.onAccountSelectorChange}
                                    value={selectedAccountId ?? ''}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        const {
            requestAccounts,
            requestLookupValues,
        } = this.props;

        requestLookupValues();
        requestAccounts();
    }

    private onDescriptionChanged(e: React.FormEvent<HTMLInputElement>) {
        const { updateDescription } = this.props;
        updateDescription(e.currentTarget.value ?? null);
    }

    private onCheckNumberChanged(e: React.FormEvent<HTMLInputElement>) {
        const parsedCheckNumber = parseInt(e.currentTarget.value, 10);
        const safeValueForUpdate = isFinite(parsedCheckNumber) ?
            parsedCheckNumber :
            null;

        const { updateCheckNumber } = this.props;
        updateCheckNumber(safeValueForUpdate);
    }

    private onEntryDateChanged(e: React.FormEvent<HTMLInputElement>) {
        const { updateEntryDate } = this.props;
        updateEntryDate(e.currentTarget.value ?? null);
    }

    private onNoteChanged(e: React.FormEvent<HTMLInputElement>) {
        const { updateNote } = this.props;
        updateNote(e.currentTarget.value ?? null);
    }

    private onPostDateChanged(e: React.FormEvent<HTMLInputElement>) {
        const { updatePostDate } = this.props;
        updatePostDate(e.currentTarget.value ?? null);
    }

    // TEMP FOR TESTING
    private onAccountSelectorChange(selectedAccount: AccountSelectOption) {
        this.setState({ selectedAccountId: selectedAccount.id });
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JournalEntryEditor as any);