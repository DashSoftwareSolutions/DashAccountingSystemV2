import * as React from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Jumbotron, Nav, NavItem, NavLink } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import * as TenantsStore from '../store/Tenants';

type ChartOfAccountsPageProps = TenantsStore.TenantsState
    & RouteComponentProps;

class ChartOfAccountsPage extends React.PureComponent<ChartOfAccountsPageProps> {
    public render() {
        const {
            selectedTenant,
        } = this.props;

        if (isEmpty(selectedTenant)) {
            return null;
        }

        return (
            <React.Fragment>
                <Jumbotron>
                    <h1>Chart of Accounts</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                </Jumbotron>
                {/* TODO: Make a Tenant Subnavigation component */}
                <Nav>
                    <NavItem>
                        <NavLink tag={Link} to="/tenant-landing-page">Dashboard</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active tag={Link} to="/chart-of-accounts">Chart of Accounts</NavLink>
                    </NavItem>
                </Nav>
            </React.Fragment>
        );
    }
}

export default withRouter(
    connect(
        (state: ApplicationState) => state.tenants, // map state to props
    )(ChartOfAccountsPage as any),
);