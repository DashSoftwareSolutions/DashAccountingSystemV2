import {
    Route,
    Routes
} from 'react-router-dom';
import ChartOfAccountsPage from '../features/accounting/chart-of-accounts/chart-of-accounts-page';
import DashboardPage from '../features/dashboard/dashboard-page';
import Layout from './layout';
import SelectTenantPage from './select-tenant-page';

import './app.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<SelectTenantPage />} />
                <Route path='/chart-of-accounts' element={<ChartOfAccountsPage />} />
                <Route path='/dashboard' element={<DashboardPage />} />
            </Route>
        </Routes>
    );
}

export default App;
