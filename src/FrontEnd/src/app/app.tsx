import './app.css';

import React from 'react';
import {
    Routes,
    Route,
} from 'react-router';
import Layout from './layout';
import AccountDetailsPage from '../features/accounting/chart-of-accounts/accountDetailsPage';
import AddJournalEntryPage from '../features/accounting/journal-entry/addJournalEntryPage';
import BalanceSheetPage from '../features/accounting/balance-sheet/balanceSheetPage';
import ChartOfAccountsPage from '../features/accounting/chart-of-accounts/chartOfAccountsPage';
import EditJournalEntryPage from '../features/accounting/journal-entry/editJournalEntryPage';
import DashboardPage from '../features/dashboard/dashboardPage';
import GeneralLedgerPage from '../features/accounting/general-ledger/generalLedgerPage';
import HomePage from './homePage';
import InvoiceListPage from '../features/invoicing/invoiceListPage';
import LoginPage from './authentication/loginPage';
import ProfitAndLossPage from '../features/accounting/profit-and-losss/profitAndLossPage';
import PrivacyPage from '../app/privacyPage';
import SelectTenantPage from './selectTenantPage';
import TimeTrackingPage from '../features/time-tracking/timeTrackingPage';
import ViewJournalEntryPage from '../features/accounting/journal-entry/viewJournalEntryPage';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/login" element={<LoginPage />} />
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

export default App;
