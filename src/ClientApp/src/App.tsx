import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import AboutPage from './components/AboutPage';
import AccountDetailsPage from './components/AccountDetailsPage';
import AddInvoicePage from './components/AddInvoicePage';
import AddJournalEntryPage from './components/AddJournalEntryPage';
import BalanceSheetPage from './components/BalanceSheetPage';
import ChartOfAccountsPage from './components/ChartOfAccountsPage';
import DashboardPage from './components/DashboardPage';
import EditJournalEntryPage from './components/EditJournalEntryPage';
import InvoiceListPage from './components/InvoiceListPage';
import LedgerPage from './components/LedgerPage';
import PrivacyPage from './components/PrivacyPage';
import ProfitAndLossPage from './components/ProfitAndLossPage';
import SelectTenant from './components/SelectTenant';
import TimeActivityReportDetailsPage from './components/TimeActivityDetailsReportPage';
import ViewInvoicePage from './components/ViewInvoicePage';
import ViewJournalEntryPage from './components/ViewJournalEntryPage';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default () => (
    <Layout>
        <AuthorizeRoute exact path='/' component={SelectTenant} />
        <Route exact path='/about' component={AboutPage} />
        <Route exact path='/privacy' component={PrivacyPage} />
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
        <AuthorizeRoute path='/invoicing' component={InvoiceListPage} />
        <AuthorizeRoute path='/invoice/new' component={AddInvoicePage} />
        <AuthorizeRoute path='/invoice/view/:invoiceNumber' component={ViewInvoicePage} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
    </Layout>
);