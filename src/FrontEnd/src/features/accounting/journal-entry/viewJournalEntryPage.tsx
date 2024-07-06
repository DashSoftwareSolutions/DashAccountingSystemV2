import { isNil } from 'lodash';
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Button,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Row,
} from 'reactstrap';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    RouteComponentProps,
    withRouter,
} from 'react-router';
import { ApplicationState } from '../../../app/store';
import NavigationSection from '../../../app/navigationSection';
import NotificationLevel from '../../../app/notifications/notificationLevel';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import Loader from '../../../common/components/loader';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import JournalEntryDetails from './journalEntryDetails';
import PostJournalEntryModalDialog from './postJournalEntryModalDialog';
import { TransactionStatus } from '../models';
import { actionCreators as journalEntryActionCreators } from './data';
import { actionCreators as ledgerActionCreators } from '../general-ledger/data';
import { actionCreators as notificationActionCreators } from '../../../app/notifications';

const logger: ILogger = new Logger('View Journal Entry Page');
const bemBlockName: string = 'view_journal_entry_page';

const mapStateToProps = (state: ApplicationState) => ({
    isDeleting: state.journalEntry.isDeleting,
    isFetching: state.journalEntry.isFetching,
    isSaving: state.journalEntry.isSaving,
    journalEntry: state.journalEntry.existingEntry,
    selectedTenant: state.bootstrap.selectedTenant,
});

const mapDispatchToProps = {
    editJournalEntry: journalEntryActionCreators.editJournalEntry,
    deleteJournalEntry: journalEntryActionCreators.deleteJournalEntry,
    requestJournalEntry: journalEntryActionCreators.requestJournalEntry,
    resetDirtyEditorState: journalEntryActionCreators.resetDirtyEditorState,
    resetLedgerReportData: ledgerActionCreators.reset,
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ViewJournalEntryPageReduxProps = ConnectedProps<typeof connector>;

type ViewJournalEntryPageProps = ViewJournalEntryPageReduxProps & RouteComponentProps<{ entryId: string }>;

function ViewJournalEntryPage(props: ViewJournalEntryPageProps) {
    const {
        deleteJournalEntry,
        editJournalEntry,
        history,
        isFetching,
        isDeleting,
        isSaving,
        journalEntry,
        match: {
            params: { entryId },
        },
        requestJournalEntry,
        resetDirtyEditorState,
        resetLedgerReportData,
        selectedTenant,
        showAlert,
    } = props;

    const wasSaving = useRef<boolean>(isSaving);
    const wasDeleting = useRef<boolean>(isDeleting);

    const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState<boolean>(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

    // Selected Tenant Check
    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            history.push('/');
        }
    }, [
        history,
        selectedTenant,
    ]);

    // "component did mount" -- fetch the Journal Entry
    useEffect(() => {
        const parsedEntryId = parseInt(entryId, 10) || 0;
        requestJournalEntry(parsedEntryId);
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // "component did update" for saving action from Post Journal Entry
    useEffect(() => {
        if (wasSaving.current &&
            !isSaving &&
            !isNil(journalEntry)) {
            logger.info('Just finished posting the journal entry.');
            showAlert(NotificationLevel.Success, `Successfully posted Journal Entry ID ${journalEntry.entryId}`, true);
            resetDirtyEditorState();
            resetLedgerReportData();
            setIsPostModalOpen(false);
        }
    }, [
        isSaving,
        journalEntry,
        resetDirtyEditorState,
        resetLedgerReportData,
        showAlert,
        wasSaving,
    ]);

    // "component did update" for deletion action
    useEffect(() => {
        if (wasDeleting.current &&
            !isDeleting) {
            setIsDeleteEntryModalOpen(false);
            logger.info('Just finished deleting the journal entry.');
            showAlert(NotificationLevel.Success, `Successfully deleted Journal Entry ID ${entryId}`, true);
            resetLedgerReportData();
            history.push('/ledger');
        }
    }, [
        entryId,
        history,
        isDeleting,
        resetLedgerReportData,
        showAlert,
    ]);

    const onClickBack = () => { history.goBack(); };

    const onClickDeleteJournalEntry = () => {
        setIsDeleteEntryModalOpen(true);
    };

    const onClickEditJournalEntry = () => {
        editJournalEntry();
        history.push(`/journal-entry/edit/${entryId}`);
    };

    const onClickPostJournalEntry = () => {
        editJournalEntry();
        setIsPostModalOpen(true);
    };

    const onClosePostEntryDialog = () => {
        setIsPostModalOpen(false);
    };

    const onDeleteJournalEntryConfirmed = () => {
        logger.info('Deleting the Journal Entry...');

        if (!isNil(journalEntry) &&
            !isNil(journalEntry.entryId)) { // NOTE: Cannot just do !isNil(journalEntry?.entryId) otherwise TypeScript compiler flags line 173 as `TS18047: 'journalEntry' is possibly 'null'.`
            deleteJournalEntry(journalEntry.entryId);
        } else {
            setIsDeleteEntryModalOpen(false);
        }
    };

    const onDeleteJournalEntryDeclined = () => {
        setIsDeleteEntryModalOpen(false);
    };

    const hasJournalEntry = !isNil(journalEntry);

    return (
        <React.Fragment>
            <TenantSubNavigation activeSection={NavigationSection.Ledger} />

            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={5}>
                        <h1>Journal Entry Details</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col className="text-end" md={7}>
                        <Button
                            color="secondary"
                            id={`${bemBlockName}--back_button`}
                            onClick={onClickBack}
                            style={{ marginRight: 22, width: 120 }}
                        >
                            Back
                        </Button>

                        {journalEntry?.status === TransactionStatus.Pending ? (
                            <>
                                <Button
                                    color="danger"
                                    id={`${bemBlockName}--delete_entry_button`}
                                    onClick={onClickDeleteJournalEntry}
                                    style={{ marginRight: 22, width: 120 }}
                                >
                                    Delete Entry
                                </Button>

                                <Button
                                    color="success"
                                    id={`${bemBlockName}--post_entry_button`}
                                    onClick={onClickPostJournalEntry}
                                    style={{ marginRight: 22, width: 120 }}
                                >
                                    Post Entry
                                </Button>
                            </>
                        ) : (
                            <></>
                        )}

                        <Button
                            color="primary"
                            id={`${bemBlockName}--edit_entry_button`}
                            onClick={onClickEditJournalEntry}
                            style={{ width: 120 }}
                        >
                            Edit Entry
                        </Button>
                    </Col>
                </Row>
            </div>

            <div id={`${bemBlockName}--content`}>
                {isFetching && (<Loader />)}

                {!isFetching && !hasJournalEntry && (
                    <div>ERROR: Could not find the Journal Entry</div>
                )}

                {!isFetching && hasJournalEntry && (
                    <JournalEntryDetails
                        bemBlockName={bemBlockName}
                        journalEntry={journalEntry}
                    />
                )}

                <PostJournalEntryModalDialog
                    isOpen={isPostModalOpen}
                    onClose={onClosePostEntryDialog}
                />

                <Modal
                    backdrop="static"
                    id={`${bemBlockName}--delete_confirm_modal`}
                    isOpen={isDeleteEntryModalOpen}
                    toggle={onDeleteJournalEntryDeclined}
                >
                    <ModalHeader toggle={onDeleteJournalEntryDeclined}>Delete Journal Entry</ModalHeader>
                    <ModalBody>
                        This action cannot be undone.  Are you sure?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            disabled={isDeleting}
                            onClick={onDeleteJournalEntryConfirmed}
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete It'}
                        </Button>
                        {' '}
                        <Button
                            color="secondary"
                            disabled={isDeleting}
                            onClick={onDeleteJournalEntryDeclined}
                        >
                            No, Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </React.Fragment>
    );
}

export default withRouter(connector(ViewJournalEntryPage));
