﻿import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron, Button } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
import TenantSubNavigation, { NavigationSection } from './TenantSubNavigation';

interface LedgerPageReduxProps {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type LedgerPageProps = LedgerPageReduxProps
    & RouteComponentProps;

class LedgerPage extends React.PureComponent<LedgerPageProps> {
    constructor(props: LedgerPageProps) {
        super(props);
        this.onClickNewJournalEntry = this.onClickNewJournalEntry.bind(this);
    }

    public render() {
        const {
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage selectedTenant={selectedTenant}>
                <Jumbotron>
                    <h1>General Ledger</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                    <Button color="primary" onClick={this.onClickNewJournalEntry}>
                        New Journal Entry
                    </Button>
                </Jumbotron>
                <TenantSubNavigation activeSection={NavigationSection.Ledger} />
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