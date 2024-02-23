import { isNil } from 'lodash';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ILogger,
    Logger
} from '../common/logging';
import {
    selectIsLoadingTenants,
    selectSelectedTenant,
    selectTenants,
    setSelectedTenant,
} from './tenantsSlice';
import { Tenant } from '../common/models';
import {
    useAppDispatch,
    useTypedSelector,
} from './store';

const logger: ILogger = new Logger('Select Tenant Page');

function SelectTenantPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isLoadingTenants = useTypedSelector(selectIsLoadingTenants);
    const selectedTenant = useTypedSelector(selectSelectedTenant);
    const tenants = useTypedSelector(selectTenants);

    useEffect(() => {
        if (!isNil(selectedTenant)) {
            logger.info(`Tenant '${selectedTenant.name}' (ID ${selectedTenant.id}) was selected.  Navigating to Dashboard page...`);
            navigate('/dashboard');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    return isLoadingTenants ? null : (
        <>
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
                        <tr key={tenant.id} onClick={() => dispatch(setSelectedTenant(tenant))} style={{ cursor: 'pointer' }}>
                            <td>{tenant.id}</td>
                            <td>{tenant.name}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default SelectTenantPage;