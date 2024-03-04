import { FormEvent } from 'react';
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
import {
    ILogger,
    Logger
} from '../../../common/logging';

const logger: ILogger = new Logger('Post Journal Entry Modal');
const bemBlockName: string = 'post_journal_entry_modal';

function PostJournalEntryModalDialog({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const onNoteChanged = (e: FormEvent<HTMLInputElement>) => {
        logger.info('Note changed.  New value: ', e.currentTarget.value);
    };

    const onPostDateChanged = (e: FormEvent<HTMLInputElement>) => {
        logger.info('Post Date changed.  New value: ', e.currentTarget.value);
    }

    const onPostJournalEntryClick = () => {
        logger.info('Posting the Journal Entry...');
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
                                    //value={postDate}
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
                                //value={journalEntry?.note ?? ''}
                            />
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    //disabled={!hasPostDate || isSaving}
                    onClick={onPostJournalEntryClick}
                >
                    {/*isSaving ? 'Posting Entry...' : */'Post Entry'}
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

export default PostJournalEntryModalDialog;
