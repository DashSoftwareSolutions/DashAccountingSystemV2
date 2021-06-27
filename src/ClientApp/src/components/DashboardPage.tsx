import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
import { NavigationSection } from './TenantSubNavigation';

interface DashboardPageReduxProps {
    selectedTenant: Tenant | null,
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type DashboardPageProps = DashboardPageReduxProps
    & RouteComponentProps;

class DashboardPage extends React.PureComponent<DashboardPageProps> {
    private bemBlockName: string = 'dashboard_page';

    public render() {
        const {
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Dashboard}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <h1>{selectedTenant?.name}</h1>
                    <p className="lead">Dashboard</p>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <p>Coming Soon...</p>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(DashboardPage as any),
);