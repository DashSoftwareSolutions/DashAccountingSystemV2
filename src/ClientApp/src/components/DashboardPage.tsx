import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
import TenantSubNavigation, { NavigationSection } from './TenantSubNavigation';

interface DashboardPageReduxProps {
    selectedTenant: Tenant | null,
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type DashboardPageProps = DashboardPageReduxProps
    & RouteComponentProps;

class DashboardPage extends React.PureComponent<DashboardPageProps> {
    public render() {
        const {
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage selectedTenant={selectedTenant}>
                <Jumbotron>
                    <h1>{selectedTenant?.name}</h1>
                    <p className="lead">Dashboard</p>
                </Jumbotron>
                <TenantSubNavigation activeSection={NavigationSection.Dashboard} />
            </TenantBasePage>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(DashboardPage as any),
);