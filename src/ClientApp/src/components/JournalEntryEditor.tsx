import * as React from 'react';
import { ApplicationState } from '../store';
import { ConnectedProps, connect } from 'react-redux';
import { isFinite, isNil } from 'lodash';
import {
    Col,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import Mode from '../models/Mode';
import JournalEntryAccount from '../models/JournalEntryAccount';
import JournalEntryAccountsEditor from './JournalEntryAccountsEditor';
import * as AccountsStore from '../store/Accounts';
import * as JournalEntryStore from '../store/JournalEntry';
import * as LookupValuesStore from '../store/LookupValues';

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

class JournalEntryEditor extends React.PureComponent<JournalEntryEditorProps> {
    private logger: ILogger;
    private bemBlockName: string = 'journal_entry_editor';

    public constructor(props: JournalEntryEditorProps) {
        super(props);

        this.logger = new Logger('Journal Entry Editor');

        this.onAccountAdded = this.onAccountAdded.bind(this);
        this.onAccountAmountChanged = this.onAccountAmountChanged.bind(this);
        this.onAccountRemoved = this.onAccountRemoved.bind(this);
        this.onCheckNumberChanged = this.onCheckNumberChanged.bind(this);
        this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
        this.onEntryDateChanged = this.onEntryDateChanged.bind(this);
        this.onNoteChanged = this.onNoteChanged.bind(this);
        this.onPostDateChanged = this.onPostDateChanged.bind(this);
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
            accounts,
            accountSelectOptions,
            assetTypes,
            journalEntry,
            mode,
        } = this.props;

        const {
            dirtyEntry,
            validation,
            totalCredits,
            totalDebits,
        } = journalEntry ?? {
            totalCredits: 0,
            totalDebits: 0,
        };

        if (isNil(dirtyEntry)) {
            return null;
        }

        const {
            attributes: attributeValidation,
            accounts: accountsValidation,
        } = validation ?? {};

        const {
            hasMixedAssetTypes,
            hasSufficientAccounts,
            isBalanced,
        } = accountsValidation ?? {
            hasMixedAssetTypes: false,
            hasSufficientAccounts: false,
            isBalanced: true,
        };

        const safeAttributeValidation = attributeValidation ?? new Map <string, JournalEntryStore.JournalEntryAttributeValidationState>();

        return (
            <React.Fragment>
                <Form style={{ marginTop: 22 }}>
                    <Row form>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--entry_date_input`}>Entry Date</Label>
                                <Input
                                    id={`${this.bemBlockName}--entry_date_input`}
                                    invalid={safeAttributeValidation.get('entryDate')?.invalid}
                                    name="entry_date_input"
                                    onChange={this.onEntryDateChanged}
                                    type="date"
                                    valid={safeAttributeValidation.get('entryDate')?.valid}
                                    value={dirtyEntry.entryDate ?? ''}
                                />
                                <FormFeedback>{safeAttributeValidation.get('entryDate')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--post_date_input`}>Post Date</Label>
                                <Input
                                    id={`${this.bemBlockName}--post_date_input`}
                                    invalid={safeAttributeValidation.get('postDate')?.invalid}
                                    name="post_date_input"
                                    onChange={this.onPostDateChanged}
                                    type="date"
                                    valid={safeAttributeValidation.get('postDate')?.valid}
                                    value={dirtyEntry.postDate ?? ''}
                                />
                                <FormFeedback>{safeAttributeValidation.get('postDate')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col sm={6} md={4}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--check_number_input`}>Check Number</Label>
                                <Input
                                    id={`${this.bemBlockName}--check_number_input`}
                                    invalid={safeAttributeValidation.get('checkNumber')?.invalid}
                                    name="check_number_input"
                                    onChange={this.onCheckNumberChanged}
                                    placeholder="check # reference (if applicable)"
                                    type="number"
                                    valid={safeAttributeValidation.get('checkNumber')?.valid}
                                    value={dirtyEntry.checkNumber?.toString() ?? ''}
                                />
                                <FormFeedback>{safeAttributeValidation.get('checkNumber')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--description_textarea`}>Transaction Description</Label>
                                <Input
                                    id={`${this.bemBlockName}--description_textarea`}
                                    invalid={safeAttributeValidation.get('description')?.invalid}
                                    maxLength={2048}
                                    name="description_textarea"
                                    onChange={this.onDescriptionChanged}
                                    placeholder="Description of transaction that will appear on all impacted accounts"
                                    rows={3}
                                    style={{ resize: 'none' }}
                                    type="textarea"
                                    valid={safeAttributeValidation.get('description')?.valid}
                                    value={dirtyEntry.description ?? ''}
                                />
                                <FormFeedback>{safeAttributeValidation.get('description')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--note_textarea`}>Additional Note</Label>
                                <Input
                                    id={`${this.bemBlockName}--note_textarea`}
                                    invalid={safeAttributeValidation.get('note')?.invalid}
                                    name="note_textarea"
                                    placeholder="Optional additional note on the transaction"
                                    onChange={this.onNoteChanged}
                                    rows={3}
                                    style={{ resize: 'none' }}
                                    type="textarea"
                                    valid={safeAttributeValidation.get('note')?.valid}
                                    value={dirtyEntry.note ?? ''}
                                />
                                <FormFeedback>{safeAttributeValidation.get('note')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <JournalEntryAccountsEditor
                                accounts={accounts ?? []}
                                accountSelectOptions={accountSelectOptions ?? []}
                                assetTypes={assetTypes ?? []}
                                entryHasMixedAssetTypes={hasMixedAssetTypes}
                                entryIsUnbalanced={hasSufficientAccounts && !isBalanced}
                                journalEntryAccounts={dirtyEntry.accounts ?? []}
                                mode={mode}
                                onAccountAdded={this.onAccountAdded}
                                onAccountAmountChanged={this.onAccountAmountChanged}
                                onAccountRemoved={this.onAccountRemoved}
                                totalCredits={totalCredits}
                                totalDebits={totalDebits}
                            />
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

    private onAccountAdded(account: JournalEntryAccount) {
        const { addAccount } = this.props;
        addAccount(account);
    }

    private onAccountAmountChanged(accountId: string, amountAsString: string | null, amount: number | null) {
        const { updateAccountAmount } = this.props;
        updateAccountAmount(accountId, amountAsString, amount);
    }

    private onAccountRemoved(accountId: string) {
        const { removeAccount } = this.props;
        removeAccount(accountId);
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
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JournalEntryEditor as any);