import * as React from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { Jumbotron } from 'reactstrap';
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
            <Jumbotron>
                <h1>{selectedTenant?.name}</h1>
            </Jumbotron>
        );
    }
}

export default withRouter(
    connect(
        (state: ApplicationState) => state.tenants, // map state to props
    )(TenantHomePage as any),
);