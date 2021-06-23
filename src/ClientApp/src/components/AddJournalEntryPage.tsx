import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import JournalEntryEditor from './JournalEntryEditor';
import Mode from '../models/Mode';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
import TenantSubNavigation, { NavigationSection } from './TenantSubNavigation';

interface AddJournalEntryPageReduxProps {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type AddJournalEntryPageProps = AddJournalEntryPageReduxProps
    & RouteComponentProps;

class AddJournalEntryPage extends React.PureComponent<AddJournalEntryPageProps> {
    public render() {
        const {
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage selectedTenant={selectedTenant}>
                <Jumbotron>
                    <h1>Add Journal Entry</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                </Jumbotron>
                <TenantSubNavigation activeSection={NavigationSection.Ledger} />
                <JournalEntryEditor mode={Mode.Add} />
            </TenantBasePage>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(AddJournalEntryPage as any),
);