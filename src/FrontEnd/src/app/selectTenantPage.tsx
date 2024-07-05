import React from 'react';
import { Link } from 'react-router-dom';

function SelectTenantPage() {
    return (
        <React.Fragment>
            <h1>Select Tenant Page</h1>
            <Link to="/dashboard">Dashboard</Link>
        </React.Fragment>
    );
}

export default SelectTenantPage;
