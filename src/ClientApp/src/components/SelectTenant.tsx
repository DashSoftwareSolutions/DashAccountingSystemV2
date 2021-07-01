import * as React from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import Tenant from '../models/Tenant';
import * as TenantsStore from '../store/Tenants';

type TenantsProps =
    TenantsStore.TenantsState
    & typeof TenantsStore.actionCreators
    & RouteComponentProps;

class Tenants extends React.PureComponent<TenantsProps> {
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate(prevProps: TenantsProps) {
        this.ensureDataFetched();

        const {
            history,
            selectedTenant,
        } = this.props;

        if (!isEmpty(selectedTenant)) {
            history.push('/dashboard');
        }
    }

    public render() {
        const { isLoading } = this.props;

        return isLoading ? (
               <p>Loading...</p> 
            ): (
                <React.Fragment>
                    <h1 id="tabelLabel">Your Companies</h1>
                    <p>Choose which company you would like to work with.</p>
                    {this.renderTenantsTable()}
                </React.Fragment>
            );
    }

    private ensureDataFetched() {
        const { requestTenants } = this.props;
        requestTenants();
    }

    private renderTenantsTable() {
        const {
            selectTenant,
            tenants,
        } = this.props;

        if (isEmpty(tenants)) {
            return null;
        }

        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map((tenant: Tenant) =>
                        <tr key={tenant.id} onClick={() => selectTenant(tenant)} style={{ cursor : 'pointer' }}>
                            <td>{tenant.id}</td>
                            <td>{tenant.name}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export default withRouter(
    connect(
        (state: ApplicationState) => state.tenants, // map state to props
        TenantsStore.actionCreators // map dispatch to props
    )(Tenants as any),
);