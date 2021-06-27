import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';

interface LedgerPageReduxProps {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type LedgerPageProps = LedgerPageReduxProps
    & RouteComponentProps;

class LedgerPage extends React.PureComponent<LedgerPageProps> {
    private bemBlockName: string = 'ledger_page';

    constructor(props: LedgerPageProps) {
        super(props);
        this.onClickNewJournalEntry = this.onClickNewJournalEntry.bind(this);
    }

    public render() {
        const {
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Ledger}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <h1>General Ledger</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                    <Button color="primary" onClick={this.onClickNewJournalEntry}>
                        New Journal Entry
                    </Button>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <p>Coming Soon...</p>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private onClickNewJournalEntry() {
        const { history } = this.props;
        history.push('/journal-entry/new');
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(LedgerPage as any),
);