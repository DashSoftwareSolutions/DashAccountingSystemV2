import * as React from 'react';
import { ApplicationState } from '../store';
import { ConnectedProps, connect } from 'react-redux';
import { isNil } from 'lodash';
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
import * as AccountsStore from '../store/Accounts';
import * as JournalEntryStore from '../store/JournalEntry';
import * as LookupValuesStore from '../store/LookupValues';

interface JournalEntryEditorOwnProps {
    mode: Mode;
}

const mapStateToProps = (state: ApplicationState, props: JournalEntryEditorOwnProps) => {
    return {
        accounts: state.accounts?.accounts,
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
        };

        this.onEntryDateChanged = this.onEntryDateChanged.bind(this);
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
            mode,
            journalEntry,
        } = this.props;

        const { dirtyEntry } = journalEntry ?? {};

        if (isNil(dirtyEntry)) {
            this.logger.warn('No journal entry was found in Redux state');
            return null;
        }

        const { attributeValidation } = this.state;

        return (
            <React.Fragment>
                <Form style={{ marginTop: 22 }}>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for={`${this.bemBlockName}--entry_date_input`}>Entry Date</Label>
                                <Input
                                    id={`${this.bemBlockName}--entry_date_input`}
                                    invalid={attributeValidation.get('entryDate')?.invalid}
                                    name="entry_date_input"
                                    placeholder="date placeholder"
                                    onChange={this.onEntryDateChanged}
                                    type="date"
                                    valid={attributeValidation.get('entryDate')?.valid}
                                    value={dirtyEntry.entryDate ?? ''}
                                />
                                <FormFeedback>{attributeValidation.get('entryDate')?.error}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <Label for={`${this.bemBlockName}--post_date_input`}>Post Date</Label>
                            <Input
                                id={`${this.bemBlockName}--post_date_input`}
                                invalid={attributeValidation.get('postDate')?.invalid}
                                name="post_date_input"
                                placeholder="date placeholder"
                                onChange={this.onPostDateChanged}
                                type="date"
                                valid={attributeValidation.get('postDate')?.valid}
                                value={dirtyEntry.postDate ?? ''}
                            />
                            <FormFeedback>{attributeValidation.get('postDate')?.error}</FormFeedback>
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

    private onEntryDateChanged(e: React.FormEvent<HTMLInputElement>) {
        this.logger.debug('Received value for entry date:', e.currentTarget.value);

        const { updateEntryDate } = this.props;
        updateEntryDate(e.currentTarget.value ?? null);
    }

    private onPostDateChanged(e: React.FormEvent<HTMLInputElement>) {
        this.logger.debug('Received value for post date:', e.currentTarget.value);

        const { updatePostDate } = this.props;
        updatePostDate(e.currentTarget.value ?? null);
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JournalEntryEditor as any);