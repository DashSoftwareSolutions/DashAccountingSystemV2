import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
// import Counter from './components/Counter';
import FetchData from './components/FetchData';
import Tenants from './components/Tenants';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        {/* <Route path='/counter' component={Counter} /> */}
        <AuthorizeRoute path='/tenants' component={Tenants} />
        <AuthorizeRoute path='/fetch-data/:startDateIndex?' component={FetchData} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
    </Layout>
);