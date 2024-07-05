import React from 'react';
import { Route } from 'react-router';
import Layout from './layout';
import DashboardPage from '../features/dashboard/dashboardPage';
import SelectTenantPage from './selectTenantPage';


function App() {

    return (
        <Layout>
            <Route exact path="/" component={SelectTenantPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
        </Layout>
    );
}

export default App;
