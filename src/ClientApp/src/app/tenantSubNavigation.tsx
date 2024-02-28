import { Link } from 'react-router-dom';
import {
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import NavigationSection from './navigationSection';

function TenantSubNavigation({
    activeSection,
}: {
    activeSection: NavigationSection;
}) {
    return (
        <Nav tabs>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.Dashboard} tag={Link} to="/dashboard">Dashboard</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.ChartOfAccounts} tag={Link} to="/chart-of-accounts">Chart of Accounts</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.Ledger} tag={Link} to="/ledger">General Ledger</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.BalanceSheet} tag={Link} to="/balance-sheet">Balance Sheet</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.ProfitAndLoss} tag={Link} to="/profit-and-loss">Profit &amp; Loss</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.TimeTracking} tag={Link} to="/time-tracking">Time Tracking</NavLink>
            </NavItem>
            <NavItem>
                <NavLink active={activeSection === NavigationSection.Invoicing} tag={Link} to="/invoicing">Invoicing</NavLink>
            </NavItem>
        </Nav>
    );
}

export default TenantSubNavigation;