import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { ApplicationState } from '../store';
import Account from '../models/Account';
import AssetType from '../models/AssetType';
import Mode from '../models/Mode';
import Tenant from '../models/Tenant';
import * as AccountsStore from '../store/Accounts';
import * as LookupValuesStore from '../store/LookupValues';

interface JournalEntryEditorOwnProps {
    mode: Mode;
}

const mapStateToProps = (state: ApplicationState, props: JournalEntryEditorOwnProps) => {
    return {
        accounts: state.accounts?.accounts,
        assetTypes: state.lookups?.assetTypes,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

const mapDispatchToProps = {
    requestAccounts: AccountsStore.actionCreators.requestAccounts,
    requestLookupValues: LookupValuesStore.actionCreators.requestLookupValues,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type JournalEntryEditorReduxProps = ConnectedProps<typeof connector>;

type JournalEntryEditorProps = JournalEntryEditorOwnProps
    & JournalEntryEditorReduxProps;

class JournalEntryEditor extends React.PureComponent<JournalEntryEditorProps> {
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public render() {
        const { mode } = this.props;

        return (
            <div>
                <h1>Journal Entry Editor</h1>
                <p>{`Mode: ${Mode[mode]}`}</p>
            </div>
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
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(JournalEntryEditor as any);