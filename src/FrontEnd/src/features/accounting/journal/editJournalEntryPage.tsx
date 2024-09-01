import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
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

const logger: ILogger = new Logger('Edit Journal Entry Page');
const bemBlockName: string = 'edit_journal_entry_page';

const mapStateToProps = (state: RootState) => ({
    canSaveJournalEntry: state.journal?.validation.canSave ?? false,
    savedEntry: state.journal?.existingEntry ?? null,
    isSaving: state.journal?.isSaving ?? false,
    selectedTenant: state.application?.selectedTenant ?? null,
});

const mapDispatchToProps = {
    requestJournalEntry: journalEntryActionCreators.requestJournalEntry,
    resetDirtyEditorState: journalEntryActionCreators.resetDirtyEditorState,
    resetLedgerReportData: ledgerActionCreators.reset,
    showAlert: notificationActionCreators.showAlert,
    updateJournalEntry: journalEntryActionCreators.updateJournalEntry,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type EditJournalEntryPageReduxProps = ConnectedProps<typeof connector>;

type EditJournalEntryPageProps = EditJournalEntryPageReduxProps;

function EditJournalEntryPage(props: EditJournalEntryPageProps) {
    const {
        canSaveJournalEntry,
        isSaving,
        requestJournalEntry,
        resetDirtyEditorState,
        resetLedgerReportData,
        savedEntry,
        selectedTenant,
        showAlert,
        updateJournalEntry,
    } = props;

    const wasSaving = usePrevious(isSaving);
    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    const { entryId: entryIdParam } = useParams();
    const entryId = parseInt(entryIdParam ?? '', 10);
    const hasValidEntryId = isFinite(entryId) && entryId > 0;

    // "component did mount" -- fetch the Journal Entry
    useEffect(() => {
        if (hasValidEntryId) {
            requestJournalEntry(entryId);
        }
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // "component did update" for saving action from Post Journal Entry
    useEffect(() => {
        if (wasSaving &&
            !isSaving &&
            !isNil(savedEntry)) {
            logger.info('Just finished updating the journal entry.');
            showAlert(NotificationLevel.Success, `Successfully updated Journal Entry ID ${savedEntry.entryId}`, true);
            resetDirtyEditorState();
            resetLedgerReportData();
            navigate('/app/ledger');
        }
    }, [
        isSaving,
        navigate,
        savedEntry,
        resetDirtyEditorState,
        resetLedgerReportData,
        showAlert,
        wasSaving,
    ]);

    const onClickCancel = () => {
        resetDirtyEditorState();
        navigate('/app/ledger');
    };

    const onClickSave = () => {
        updateJournalEntry();
    };

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col md={6}>
                        <h1>Edit Journal Entry</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>

                    <Col
                        md={6}
                        style={{ textAlign: 'right' }}
                    >
                        <Button
                            color="secondary"
                            id={`${bemBlockName}--cancel_button`}
                            onClick={onClickCancel}
                            style={{
                                marginRight: 22,
                                width: 88,
                            }}
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
                <JournalEntryEditor mode={Mode.Edit} />
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(EditJournalEntryPage);
