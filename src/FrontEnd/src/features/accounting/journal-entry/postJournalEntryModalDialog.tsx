import { FormEvent } from 'react';
import { DateTime } from 'luxon';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    Button,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
} from 'reactstrap';
import { ApplicationState } from '../../../app/store';
import {
    ILogger,
    Logger
} from '../../../common/logging';
import { actionCreators as journalEntryActionCreators } from './data';

const logger: ILogger = new Logger('Post Journal Entry Modal Dialog');
const bemBlockName: string = 'post_journal_entry_modal';

interface PostJournalEntryModalDialogOwnProps {
    isOpen: boolean;
    onClose: React.MouseEventHandler<any>;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        isSaving: state.journalEntry?.isSaving ?? false,
        journalEntry: state.journalEntry?.dirtyEntry,
    };
}

const mapDispatchToProps = {
    postJournalEntry: journalEntryActionCreators.postJournalEntry,
    updateNote: journalEntryActionCreators.updateNote,
    updatePostDate: journalEntryActionCreators.updatePostDate,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PostJournalEntryModalDialogReduxProps = ConnectedProps<typeof connector>;

type PostJournalEntryModalDialogProps = PostJournalEntryModalDialogOwnProps &
    PostJournalEntryModalDialogReduxProps;

function PostJournalEntryModalDialog(props: PostJournalEntryModalDialogProps) {
    const {
        isOpen,
        isSaving,
        journalEntry,
        onClose,
        postJournalEntry,
        updateNote,
        updatePostDate,
    } = props;

    const postDate = journalEntry?.postDate ?? '';

    const hasPostDate = /(\d{4})-(\d{2})-(\d{2})/.test(postDate) && DateTime.fromISO(postDate).isValid;

    const onNoteChanged = (e: FormEvent<HTMLInputElement>) => {
        updateNote(e.currentTarget.value ?? null);
    };

    const onPostDateChanged = (e: FormEvent<HTMLInputElement>) => {
        updatePostDate(e.currentTarget.value ?? null);
    }

    const onPostJournalEntryClick = () => {
        logger.info('Posting the Journal Entry...');
        postJournalEntry();
    }

    return (
        <Modal
            backdrop="static"
            centered
            id={bemBlockName}
            isOpen={isOpen}
            toggle={onClose}
        >
            <ModalHeader toggle={onClose}>Post Journal Entry</ModalHeader>
            <ModalBody>
                <Form>
                    <Row className="g-2">
                        <Col sm={12}>
                            <FormGroup>
                                <Label for={`${bemBlockName}--post_date_input`}>Post Date</Label>
                                <Input
                                    id={`${bemBlockName}--post_date_input`}
                                    name="post_date_input"
                                    onChange={onPostDateChanged}
                                    type="date"
                                    value={postDate}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Label for={`${bemBlockName}--note_textarea`}>Additional Note</Label>
                            <Input
                                id={`bemBlockNamebemBlockName}--note_textarea`}
                                name="note_textarea"
                                placeholder="Optional additional note on the transaction"
                                onChange={onNoteChanged}
                                rows={3}
                                style={{ resize: 'none' }}
                                type="textarea"
                                value={journalEntry?.note ?? ''}
                            />
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    disabled={!hasPostDate || isSaving}
                    onClick={onPostJournalEntryClick}
                >
                    {isSaving ? 'Posting Entry...' : 'Post Entry'}
                </Button>
                <Button
                    color="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default connector(PostJournalEntryModalDialog);
