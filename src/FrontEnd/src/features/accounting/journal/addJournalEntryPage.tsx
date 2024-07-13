import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import JournalEntryEditor from './journalEntryEditor';
import { actionCreators as journalEntryActionCreators } from './redux';
import { RootState } from '../../../app/globalReduxStore';
import {
    actionCreators as notificationActionCreators,
    NotificationLevel,
} from '../../../app/notifications';
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import { Mode } from '../../../common/models';
import usePrevious from '../../../common/utilities/usePrevious';
import { actionCreators as ledgerActionCreators } from '../general-ledger/redux';

const logger: ILogger = new Logger('Add Journal Entry Page');
const bemBlockName: string = 'add_new_journal_entry_page';

const mapStateToProps = (state: RootState) => ({
    canSaveJournalEntry: state.journal?.validation.canSave ?? false,
    selectedTenant: state.application.selectedTenant,
    savedEntry: state.journal?.existingEntry ?? null,
    isSaving: state.journal?.isSaving ?? false,
});

const mapDispatchToProps = {
    resetDirtyEditorState: journalEntryActionCreators.resetDirtyEditorState,
    resetLedgerReportData: ledgerActionCreators.reset,
    saveNewJournalEntry: journalEntryActionCreators.saveNewJournalEntry,
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type AddJournalEntryPageReduxProps = ConnectedProps<typeof connector>;

type AddJournalEntryPageProps = AddJournalEntryPageReduxProps;

function AddJournalEntryPage(props: AddJournalEntryPageProps) {
    const {
        canSaveJournalEntry,
        isSaving,
        resetDirtyEditorState,
        resetLedgerReportData,
        saveNewJournalEntry,
        savedEntry,
        selectedTenant,
        showAlert,
    } = props;

    const navigate = useNavigate();
    const wasSaving = usePrevious(isSaving);

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    useEffect(() => {
        if (wasSaving &&
            !isSaving &&
            !isNil(savedEntry)) {
            logger.debug('Just finished saving the journal entry.');
            logger.debug('Saved Entry has Entry ID:', savedEntry.entryId);
            showAlert(NotificationLevel.Success, `Successfully created Journal Entry ID ${savedEntry.entryId}`, true);
            resetDirtyEditorState();
            resetLedgerReportData();
            navigate('/app/ledger');
        }
    }, [
        isSaving,
        navigate,
        resetDirtyEditorState,
        resetLedgerReportData,
        savedEntry,
        showAlert,
        wasSaving,
    ]);

    const onClickCancel = () => {
        resetDirtyEditorState();
        navigate('/app/ledger');
    };

    const onClickSave = () => {
        logger.info('Saving the journal entry...');
        saveNewJournalEntry();
    };

    return (
        <React.Fragment>
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={6}>
                        <h1>Add Journal Entry</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col md={6} style={{ textAlign: 'right' }}>
                        <Button
                            color="secondary"
                            id={`${bemBlockName}--cancel_button`}
                            onClick={onClickCancel}
                            style={{ marginRight: 22, width: 88 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="success"
                            disabled={isSaving || !canSaveJournalEntry}
                            id={`${bemBlockName}--save_button`}
                            onClick={onClickSave}
                            style={{ width: 88 }}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                <JournalEntryEditor mode={Mode.Add} />
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(AddJournalEntryPage);
