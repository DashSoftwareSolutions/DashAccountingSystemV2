import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import ChartOfAccountsPage from './components/ChartOfAccountsPage';
import FetchData from './components/FetchData';
import Tenants from './components/Tenants';
import TenantHomePage from './components/TenantHomePage';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <AuthorizeRoute path='/chart-of-accounts' component={ChartOfAccountsPage} />
        <AuthorizeRoute path='/tenant-landing-page' component={TenantHomePage} />
        <AuthorizeRoute path='/select-tenant' component={Tenants} />
        <AuthorizeRoute path='/fetch-data/:startDateIndex?' component={FetchData} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
    </Layout>
);