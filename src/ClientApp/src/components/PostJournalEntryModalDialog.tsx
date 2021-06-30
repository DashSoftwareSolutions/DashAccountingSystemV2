import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
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
import moment from 'moment-timezone';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import * as JournalEntryStore from '../store/JournalEntry';

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
    postJournalEntry: JournalEntryStore.actionCreators.postJournalEntry,
    updateNote: JournalEntryStore.actionCreators.updateNote,
    updatePostDate: JournalEntryStore.actionCreators.updatePostDate,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PostJournalEntryModalDialogReduxProps = ConnectedProps<typeof connector>;

type PostJournalEntryModalDialogProps = PostJournalEntryModalDialogOwnProps &
    PostJournalEntryModalDialogReduxProps;

class PostJournalEntryModalDialog extends React.PureComponent<PostJournalEntryModalDialogProps> {
    private logger: ILogger;
    private bemBlockName: string = 'post_journal_entry_modal';

    public constructor(props: PostJournalEntryModalDialogProps) {
        super(props);

        this.logger = new Logger('Post Journal Entry Modal');

        this.onNoteChanged = this.onNoteChanged.bind(this);
        this.onPostDateChanged = this.onPostDateChanged.bind(this);
        this.onPostJournalEntryClick = this.onPostJournalEntryClick.bind(this);
    }

    public render() {
        const {
            isOpen,
            isSaving,
            journalEntry,
            onClose,
        } = this.props;

        const postDate = journalEntry?.postDate ?? '';

        const hasPostDate = /(\d{4})-(\d{2})-(\d{2})/.test(postDate) &&
            moment(postDate).isValid();

        return (
            <Modal
                centered
                id={this.bemBlockName}
                isOpen={isOpen}
                toggle={onClose}
            >
                <ModalHeader toggle={onClose}>Post Journal Entry</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row form>
                            <Col sm={12}>
                                <FormGroup>
                                    <Label for={`${this.bemBlockName}--post_date_input`}>Post Date</Label>
                                    <Input
                                        id={`${this.bemBlockName}--post_date_input`}
                                        name="post_date_input"
                                        onChange={this.onPostDateChanged}
                                        type="date"
                                        value={postDate}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Label for={`${this.bemBlockName}--note_textarea`}>Additional Note</Label>
                                <Input
                                    id={`${this.bemBlockName}--note_textarea`}
                                    name="note_textarea"
                                    placeholder="Optional additional note on the transaction"
                                    onChange={this.onNoteChanged}
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
                        onClick={this.onPostJournalEntryClick}
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

    private onNoteChanged(e: React.FormEvent<HTMLInputElement>) {
        const { updateNote } = this.props;
        updateNote(e.currentTarget.value ?? null);
    }

    private onPostDateChanged(e: React.FormEvent<HTMLInputElement>) {
        const { updatePostDate } = this.props;
        updatePostDate(e.currentTarget.value ?? null);
    }

    private onPostJournalEntryClick(event: React.MouseEvent<any>) {
        this.logger.debug('Posting the journal entry...');

        const { postJournalEntry } = this.props;
        postJournalEntry();
    }
}

export default connector(PostJournalEntryModalDialog);