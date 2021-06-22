import * as React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

export enum NavigationSection {
    ChartOfAccounts,
    Dashboard,
    Ledger,
    Reports
};

interface TenantSubNavigationProps {
    activeSection: NavigationSection,
};

const TenantSubNavigation: React.FC<TenantSubNavigationProps> = ({ activeSection }) => (
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
            <NavLink active={activeSection === NavigationSection.Reports} tag={Link} to="/reports">Reports</NavLink>
        </NavItem>
    </Nav>
);

export default TenantSubNavigation