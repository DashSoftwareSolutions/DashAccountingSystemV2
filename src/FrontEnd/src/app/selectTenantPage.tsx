import React, {
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    ILogger,
    Logger,
} from '../common/logging';
import { actionCreators as bootstrapActionCreators } from './bootstrap';
import { ApplicationState } from './store';
import { Tenant } from '../common/models';

const logger: ILogger = new Logger('Select Tenant Page');

const mapStateToProps = (state: ApplicationState) => ({
    selectedTenant: state.bootstrap.selectedTenant,
    tenants: state.bootstrap.tenants,
});

const mapDispatchToProps = {
    selectTenant: bootstrapActionCreators.selectTenant,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type SelectTenantPageReduxProps = ConnectedProps<typeof connector>;

type SelectTenantPageProps = SelectTenantPageReduxProps;

function SelectTenantPage(props: SelectTenantPageProps) {
    const {
        selectTenant,
        selectedTenant,
        tenants,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        if (!isNil(selectedTenant)) {
            logger.info('Selected Tenant: ', selectedTenant);
            navigate('/app/dashboard');
        }
    }, [
        history,
        selectedTenant,
    ]);

    const onClickTenant = useCallback((tenant: Tenant) => {
        selectTenant(tenant);
    }, [selectTenant]);

    return (
        <React.Fragment>
            <h1 id="tabelLabel">Your Companies</h1>
            <p>Choose which company you would like to work with.</p>
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map((tenant: Tenant) =>
                        <tr key={tenant.id} onClick={() => onClickTenant(tenant)} style={{ cursor: 'pointer' }}>
                            <td>{tenant.id}</td>
                            <td>{tenant.name}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </React.Fragment>
    );
}

export default connector(SelectTenantPage);
