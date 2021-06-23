import * as React from 'react';
import Mode from '../models/Mode';

interface JournalEntryEditorOwnProps {
    mode: Mode;
}

type JournalEntryEditorProps = JournalEntryEditorOwnProps;

class JournalEntryEditor extends React.PureComponent<JournalEntryEditorProps> {
    render() {
        const { mode } = this.props;

        return (
            <div>
                <h1>Journal Entry Editor</h1>
                <p>{`Mode: ${Mode[mode]}`}</p>
            </div>
        );
    }
}

export default JournalEntryEditor;