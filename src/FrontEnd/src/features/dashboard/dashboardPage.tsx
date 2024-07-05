import React from 'react';
import { Link } from 'react-router-dom';

function DashboardPage() {
    return (
        <React.Fragment>
            <h1>Dashboard</h1>
            <Link to="/">Select Tenant Page</Link>
        </React.Fragment>
    );
}

export default DashboardPage;
