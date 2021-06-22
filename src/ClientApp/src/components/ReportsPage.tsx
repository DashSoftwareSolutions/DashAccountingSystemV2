import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
import TenantSubNavigation, { NavigationSection } from './TenantSubNavigation';

interface ReportsPageReduxProps {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type ReportsPageProps = ReportsPageReduxProps
    & RouteComponentProps;

class ReportsPage extends React.PureComponent<ReportsPageProps> {
    public render() {
        const {
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage selectedTenant={selectedTenant}>
                <Jumbotron>
                    <h1>Reports</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                </Jumbotron>
                <TenantSubNavigation activeSection={NavigationSection.Reports} />
            </TenantBasePage>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(ReportsPage as any),
);