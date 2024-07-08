import { Link } from 'react-router-dom';
import {
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import NavigationSection from '../common/models/navigationSection.model';

function TenantSubNavigation({
    activeSection,
}: {
    activeSection: NavigationSection;
}) {
    return (
        <Nav tabs>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.Dashboard} tag={Link} to="/app/dashboard">Dashboard</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.ChartOfAccounts} tag={Link} to="/app/chart-of-accounts">Chart of Accounts</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.Ledger} tag={Link} to="/app/ledger">General Ledger</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.BalanceSheet} tag={Link} to="/app/balance-sheet">Balance Sheet</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.ProfitAndLoss} tag={Link} to="/app/profit-and-loss">Profit &amp; Loss</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.TimeTracking} tag={Link} to="/app/time-tracking">Time Tracking</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.Invoicing} tag={Link} to="/app/invoicing">Invoicing</NavLink>
            </NavItem>
        </Nav>
    );
}

export default TenantSubNavigation;