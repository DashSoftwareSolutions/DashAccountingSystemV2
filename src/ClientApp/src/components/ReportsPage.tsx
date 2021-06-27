import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';

interface ReportsPageReduxProps {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type ReportsPageProps = ReportsPageReduxProps
    & RouteComponentProps;

class ReportsPage extends React.PureComponent<ReportsPageProps> {
    private bemBlockName: string = 'reports_page';

    public render() {
        const {
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Reports}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <h1>Reports</h1>
                    <p className="lead">{selectedTenant?.name}</p>
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
    )(ReportsPage as any),
);