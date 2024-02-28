import {
    Route,
    Routes
} from 'react-router-dom';
import BalanceSheetPage from '../features/accounting/balance-sheet/balanceSheetPage';
import ChartOfAccountsPage from '../features/accounting/chart-of-accounts/chartOfAccountsPage';
import DashboardPage from '../features/dashboard/dashboardPage';
import GeneralLedgerPage from '../features/accounting/general-ledger/generalLedgerPage';
import InvoiceListPage from '../features/invoicing/invoiceListPage';
import Layout from './layout';
import ProfitAndLossPage from '../features/accounting/profit-and-loss/profitAndLossPage';
import SelectTenantPage from './selectTenantPage';
import TimeTrackingPage from '../features/time-tracking/timeTrackingPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<SelectTenantPage />} />
                <Route path='/balance-sheet' element={<BalanceSheetPage />} />
                <Route path='/chart-of-accounts' element={<ChartOfAccountsPage />} />
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/invoicing' element={<InvoiceListPage />} />
                <Route path='/ledger' element={<GeneralLedgerPage />} />
                <Route path='/profit-and-loss' element={<ProfitAndLossPage />} />
                <Route path='/time-tracking' element={<TimeTrackingPage />} />
            </Route>
        </Routes>
    );
}

export default App;
