﻿import * as React from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Jumbotron, Nav, NavItem, NavLink } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import * as TenantsStore from '../store/Tenants';

type TenantHomePageProps = TenantsStore.TenantsState
    & RouteComponentProps;

class TenantHomePage extends React.PureComponent<TenantHomePageProps> {
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
                    <h1>{selectedTenant?.name}</h1>
                </Jumbotron>
                {/* TODO: Make a Tenant Subnavigation component */ }
                <Nav>
                    <NavItem>
                        <NavLink active tag={Link} to="/tenant-landing-page">Dashboard</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/chart-of-accounts">Chart of Accounts</NavLink>
                    </NavItem>
                </Nav>
            </React.Fragment>
        );
    }
}

export default withRouter(
    connect(
        (state: ApplicationState) => state.tenants, // map state to props
    )(TenantHomePage as any),
);