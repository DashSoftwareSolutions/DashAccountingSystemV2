import './app.css';

import React from 'react';
import {
    Routes,
    Route,
} from 'react-router';
import LoginPage from './authentication/loginPage';
import LogoutPage from './authentication/logoutPage';
import HomePage from './homePage';
import Layout from './layout';
import SelectTenantPage from './selectTenantPage';
import PrivacyPage from '../app/privacyPage';
import BalanceSheetPage from '../features/accounting/balance-sheet/balanceSheetPage';
import AccountDetailsPage from '../features/accounting/chart-of-accounts/accountDetailsPage';
import ChartOfAccountsPage from '../features/accounting/chart-of-accounts/chartOfAccountsPage';
import GeneralLedgerPage from '../features/accounting/general-ledger/generalLedgerPage';
import AddJournalEntryPage from '../features/accounting/journal/addJournalEntryPage';
import EditJournalEntryPage from '../features/accounting/journal/editJournalEntryPage';
import ViewJournalEntryPage from '../features/accounting/journal/viewJournalEntryPage';
import ProfitAndLossPage from '../features/accounting/profit-and-losss/profitAndLossPage';
import DashboardPage from '../features/dashboard/dashboardPage';
import InvoiceListPage from '../features/invoicing/invoiceListPage';
import TimeTrackingPage from '../features/time-tracking/timeTrackingPage';

/* eslint-disable react/jsx-sort-props, react/jsx-max-props-per-line */
function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/app" element={<SelectTenantPage />} />
                <Route path='/app/account-details' element={<AccountDetailsPage />} />
                <Route path='/app/balance-sheet' element={<BalanceSheetPage />} />
                <Route path='/app/chart-of-accounts' element={<ChartOfAccountsPage />} />
                <Route path='/app/dashboard' element={<DashboardPage />} />
                <Route path='/app/journal-entry/new' element={<AddJournalEntryPage />} />
                <Route path='/app/journal-entry/edit/:entryId' element={<EditJournalEntryPage />} />
                <Route path='/app/journal-entry/view/:entryId' element={<ViewJournalEntryPage />} />
                <Route path='/app/invoicing' element={<InvoiceListPage />} />
                <Route path='/app/ledger' element={<GeneralLedgerPage />} />
                <Route path='/app/profit-and-loss' element={<ProfitAndLossPage />} />
                <Route path='/app/time-tracking' element={<TimeTrackingPage />} />
            </Route>
        </Routes>
    );
}
/* eslint-enable react/jsx-sort-props, react/jsx-max-props-per-line */

export default App;
