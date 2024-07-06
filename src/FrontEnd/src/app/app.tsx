import './app.css';

import React from 'react';
import { Route } from 'react-router';
import Layout from './layout';
import AccountDetailsPage from '../features/accounting/chart-of-accounts/accountDetailsPage';
import AddJournalEntryPage from '../features/accounting/journal-entry/addJournalEntryPage';
import BalanceSheetPage from '../features/accounting/balance-sheet/balanceSheetPage';
import ChartOfAccountsPage from '../features/accounting/chart-of-accounts/chartOfAccountsPage';
import EditJournalEntryPage from '../features/accounting/journal-entry/editJournalEntryPage';
import DashboardPage from '../features/dashboard/dashboardPage';
import GeneralLedgerPage from '../features/accounting/general-ledger/generalLedgerPage';
import InvoiceListPage from '../features/invoicing/invoiceListPage';
import ProfitAndLossPage from '../features/accounting/profit-and-losss/profitAndLossPage';
import SelectTenantPage from './selectTenantPage';
import TimeTrackingPage from '../features/time-tracking/timeTrackingPage';
import ViewJournalEntryPage from '../features/accounting/journal-entry/viewJournalEntryPage';

function App() {
    return (
        <Layout>
            <Route exact path="/" component={SelectTenantPage} />
            <Route exact path="/account-details" component={AccountDetailsPage} />
            <Route exact path="/balance-sheet" component={BalanceSheetPage} />
            <Route exact path="/chart-of-accounts" component={ChartOfAccountsPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route exact path='/journal-entry/new' component={AddJournalEntryPage} />
            <Route exact path='/journal-entry/view/:entryId' component={ViewJournalEntryPage} />
            <Route exact path='/journal-entry/edit/:entryId' component={EditJournalEntryPage} />
            <Route exact path="/invoicing" component={InvoiceListPage} />
            <Route exact path="/ledger" component={GeneralLedgerPage} />
            <Route exact path="/profit-and-loss" component={ProfitAndLossPage} />
            <Route exact path="/time-tracking" component={TimeTrackingPage} />
        </Layout>
    );
}

export default App;
