import {
    isFinite,
    isNil,
} from 'lodash';
import {
    useEffect,
    useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    ILogger,
    Logger
} from '../../../common/logging';
import JournalEntryDetails from './journalEntryDetails';
import NavigationSection from '../../../app/navigationSection';
import PostJournalEntryModalDialog from './postJournalEntryModalDialog';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import { TransactionStatus } from '../models';
import { selectSelectedTenant } from '../../../app/tenantsSlice';
import { useGetJournalEntryQuery } from '../api';
import {
    useTypedSelector,
} from '../../../app/store';

const logger: ILogger = new Logger('View Journal Entry Page');
const bemBlockName: string = 'view_journal_entry_page';

function ViewJournalEntryPage() {
    const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState<boolean>(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    const selectedTenant = useTypedSelector(selectSelectedTenant);
    const { entryId: entryIdParam } = useParams();

    const entryId = parseInt(entryIdParam ?? '', 10);
    const hasValidEntryId = isFinite(entryId) && entryId > 0;

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    const onClickBack = () => {
        navigate(-1);
    };

    const onClickDeleteJournalEntry = () => {
        setIsDeleteEntryModalOpen(true);
    };

    const onClickEditJournalEntry = () => {
        logger.info('Edit Journal Entry...');
    };

    const onClickPostJournalEntry = () => {
        setIsPostModalOpen(true);
    };

    const onClosePostEntryDialog = () => {
        setIsPostModalOpen(false);
    };

    const onDeleteJournalEntryConfirmed = () => {
        logger.info('Deleting the Journal Entry...');
    };

    const onDeleteJournalEntryDeclined = () => {
        setIsDeleteEntryModalOpen(false);
    };

    const { isFetching, data: journalEntry } = useGetJournalEntryQuery({ tenantId: selectedTenant?.id ?? '', entryId }, {
        skip: isNil(selectedTenant) || !hasValidEntryId,
    });

    return (
        <>
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
                {isFetching ? (
                    <div>Loading ...</div>
                ): (
                    <JournalEntryDetails bemBlockName={bemBlockName} journalEntry={journalEntry} />
                )}

                <PostJournalEntryModalDialog isOpen={isPostModalOpen} onClose={onClosePostEntryDialog} />

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
                            //disabled={isDeleting}
                            onClick={onDeleteJournalEntryConfirmed}
                        >
                            {/*isDeleting ? 'Deleting...' : */'Yes, Delete It'}
                        </Button>
                        {' '}
                        <Button
                            color="secondary"
                            //disabled={isDeleting}
                            onClick={onDeleteJournalEntryDeclined}
                        >
                            No, Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
}

export default ViewJournalEntryPage;
