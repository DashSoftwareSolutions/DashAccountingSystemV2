import React, { useEffect } from 'react';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    isFinite,
    isNil,
} from 'lodash';
import { RootState } from '../../../app/globalReduxStore';
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
} from '../../../common/logging';
import { Mode } from '../../../common/models';
import { JournalEntryAccount } from './models';
import JournalEntryAccountsEditor from './journalEntryAccountsEditor';
import { actionCreators as accountActionCreators } from '../chart-of-accounts/redux';
import {
    actionCreators as journalEntryActionCreators,
    JournalEntryAttributeValidationState,
} from './redux';
import { actionCreators as lookupValueActionCreators } from '../../../app/lookupValues';

const logger: ILogger = new Logger('Journal Entry Editor');
const bemBlockName: string = 'journal_entry_editor';

interface JournalEntryEditorOwnProps {
    mode: Mode;
}

const mapStateToProps = (state: RootState, props: JournalEntryEditorOwnProps) => {
    return {
        accounts: state.chartOfAccounts?.accounts,
        accountSelectOptions: state.chartOfAccounts?.accountSelectOptions,
        assetTypes: state.lookups?.assetTypes,
        journalEntry: state.journal,
        selectedTenant: state.application?.selectedTenant,
    };
};

const mapDispatchToProps = {
    ...journalEntryActionCreators,
    requestAccounts: accountActionCreators.requestAccounts,
    requestLookupValues: lookupValueActionCreators.requestLookupValues,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type JournalEntryEditorReduxProps = ConnectedProps<typeof connector>;

type JournalEntryEditorProps = JournalEntryEditorOwnProps & JournalEntryEditorReduxProps;

function JournalEntryEditor(props: JournalEntryEditorProps) {
    const {
        accounts,
        accountSelectOptions,
        addAccount,
        assetTypes,
        initializeNewJournalEntry,
        journalEntry,
        mode,
        removeAccount,
        requestAccounts,
        requestLookupValues,
        updateAccountAmount,
        updateCheckNumber,
        updateDescription,
        updateEntryDate,
        updateNote,
        updatePostDate,
    } = props;

    const {
        dirtyEntry,
        validation,
        totalCredits,
        totalDebits,
    } = journalEntry ?? {
        totalCredits: 0,
        totalDebits: 0,
    };

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

    const safeAttributeValidation = attributeValidation ?? new Map<string, JournalEntryAttributeValidationState>();

    // "component did mount" useEffect() hook
    useEffect(() => {
        logger.info('Mounted ... fetching accounts and lookups ...');
        requestLookupValues();
        requestAccounts();

        if (mode === Mode.Add) {
            logger.info('Initializing a new Journal Entry ...');
            initializeNewJournalEntry();
        }

        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // event handler functions
    const onAccountAdded = (account: JournalEntryAccount) => {
        addAccount(account);
    };

    const onAccountAmountChanged = (accountId: string, amountAsString: string | null, amount: number | null) => {
        updateAccountAmount(accountId, amountAsString, amount);
    };

    const onAccountRemoved = (accountId: string) => {
        removeAccount(accountId);
    };

    const onCheckNumberChanged = (e: React.FormEvent<HTMLInputElement>) => {
        const parsedCheckNumber = parseInt(e.currentTarget.value, 10);
        const safeValueForUpdate = isFinite(parsedCheckNumber) ? parsedCheckNumber : null;
        updateCheckNumber(safeValueForUpdate);
    };

    const onDescriptionChanged = (e: React.FormEvent<HTMLInputElement>) => {
        updateDescription(e.currentTarget.value ?? null);
    };

    const onEntryDateChanged = (e: React.FormEvent<HTMLInputElement>) => {
        updateEntryDate(e.currentTarget.value ?? null);
    };

    const onNoteChanged = (e: React.FormEvent<HTMLInputElement>) => {
        updateNote(e.currentTarget.value ?? null);
    };

    const onPostDateChanged = (e: React.FormEvent<HTMLInputElement>) => {
        updatePostDate(e.currentTarget.value ?? null);
    };

    if (isNil(dirtyEntry)) {
        return null;
    }

    return (
        <Form style={{ marginTop: 22 }}>
            <Row>
                <Col sm={6} md={4}>
                    <FormGroup>
                        <Label for={`${bemBlockName}--entry_date_input`}>Entry Date</Label>
                        <Input
                            id={`${bemBlockName}--entry_date_input`}
                            invalid={safeAttributeValidation.get('entryDate')?.invalid}
                            name="entry_date_input"
                            onChange={onEntryDateChanged}
                            type="date"
                            valid={safeAttributeValidation.get('entryDate')?.valid}
                            value={dirtyEntry.entryDate ?? ''}
                        />
                        <FormFeedback>{safeAttributeValidation.get('entryDate')?.error}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col sm={6} md={4}>
                    <FormGroup>
                        <Label for={`${bemBlockName}--post_date_input`}>Post Date</Label>
                        <Input
                            id={`${bemBlockName}--post_date_input`}
                            invalid={safeAttributeValidation.get('postDate')?.invalid}
                            name="post_date_input"
                            onChange={onPostDateChanged}
                            type="date"
                            valid={safeAttributeValidation.get('postDate')?.valid}
                            value={dirtyEntry.postDate ?? ''}
                        />
                        <FormFeedback>{safeAttributeValidation.get('postDate')?.error}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col sm={6} md={4}>
                    <FormGroup>
                        <Label for={`${bemBlockName}--check_number_input`}>Check Number</Label>
                        <Input
                            id={`${bemBlockName}--check_number_input`}
                            invalid={safeAttributeValidation.get('checkNumber')?.invalid}
                            name="check_number_input"
                            onChange={onCheckNumberChanged}
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
                        <Label for={`${bemBlockName}--description_textarea`}>Transaction Description</Label>
                        <Input
                            id={`${bemBlockName}--description_textarea`}
                            invalid={safeAttributeValidation.get('description')?.invalid}
                            maxLength={2048}
                            name="description_textarea"
                            onChange={onDescriptionChanged}
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
                        <Label for={`${bemBlockName}--note_textarea`}>Additional Note</Label>
                        <Input
                            id={`addAccountbemBlockName}--note_textarea`}
                            invalid={safeAttributeValidation.get('note')?.invalid}
                            name="note_textarea"
                            placeholder="Optional additional note on the transaction"
                            onChange={onNoteChanged}
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
                        onAccountAdded={onAccountAdded}
                        onAccountAmountChanged={onAccountAmountChanged}
                        onAccountRemoved={onAccountRemoved}
                        totalCredits={totalCredits}
                        totalDebits={totalDebits}
                    />
                </Col>
            </Row>
        </Form>
    );
}

export default connector(JournalEntryEditor);
