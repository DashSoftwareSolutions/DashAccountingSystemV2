import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import AboutPage from './components/AboutPage';
import AccountDetailsPage from './components/AccountDetailsPage';
import AddJournalEntryPage from './components/AddJournalEntryPage';
import BalanceSheetPage from './components/BalanceSheetPage';
import ChartOfAccountsPage from './components/ChartOfAccountsPage';
import DashboardPage from './components/DashboardPage';
import EditJournalEntryPage from './components/EditJournalEntryPage';
import LedgerPage from './components/LedgerPage';
import ProfitAndLossPage from './components/ProfitAndLossPage';
import SelectTenant from './components/SelectTenant';
import TimeActivityReportDetailsPage from './components/TimeActivityDetailsReportPage';
import ViewJournalEntryPage from './components/ViewJournalEntryPage';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default () => (
    <Layout>
        <AuthorizeRoute exact path='/' component={SelectTenant} />
        <Route exact path='/about' component={AboutPage} />
        <AuthorizeRoute path='/account-details' component={AccountDetailsPage} />
        <AuthorizeRoute path='/balance-sheet' component={BalanceSheetPage} />
        <AuthorizeRoute path='/chart-of-accounts' component={ChartOfAccountsPage} />
        <AuthorizeRoute path='/dashboard' component={DashboardPage} />
        <AuthorizeRoute path='/journal-entry/new' component={AddJournalEntryPage} />
        <AuthorizeRoute path='/journal-entry/view/:entryId' component={ViewJournalEntryPage} />
        <AuthorizeRoute path='/journal-entry/edit/:entryId' component={EditJournalEntryPage} />
        <AuthorizeRoute path='/ledger' component={LedgerPage} />
        <AuthorizeRoute path='/profit-and-loss' component={ProfitAndLossPage} />
        <AuthorizeRoute path='/time-tracking' component={TimeActivityReportDetailsPage} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
    </Layout>
);