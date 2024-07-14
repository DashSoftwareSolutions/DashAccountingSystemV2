import './navMenu.css';

import React, { useCallback, } from 'react';
import {
    isEmpty,
    isNil,
} from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    Link,
    useNavigate,
} from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavItem,
    NavLink,
} from 'reactstrap';
import { actionCreators } from './applicationRedux';
import { RootState } from './globalReduxStore';
import NavMenuItem from './navMenuItem';
import { NavigationSection } from '../common/models';
import useNamedState from '../common/utilities/useNamedState';

const mapStateToProps = (state: RootState) => ({
    isLoggedIn: state.authentication.isLoggedIn,
    selectedNavigationSection: state.application.selectedNavigationSection,
    selectedTenant: state.application.selectedTenant,
    userInfo: state.application.userInfo,
});

const mapDispatchToProps = {
    setNavigationSection: actionCreators.setNavigationSection,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector>;

function NavMenu({
    userInfo,
    selectedNavigationSection,
    selectedTenant,
    setNavigationSection,
}: PropTypes) {
    const [isOpen, setIsOpen] = useNamedState<boolean>('isOpen', false);
    const navigate = useNavigate();

    const toggleNavMenu = useCallback(() => {
        setIsOpen(!isOpen);
    }, [
        isOpen,
        setIsOpen,
    ]);

    const goToPage = (navigationSection: NavigationSection, path: string) => {
        setNavigationSection(navigationSection);
        navigate(path);
    };

    const hasUser = !isEmpty(userInfo?.id);
    const hasSelectedTenant = !isNil(selectedTenant);

    return (
        <header>
            <Navbar
                className="navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3"
                light
            >
                <Link className="navbar-brand"
                    to="/">
                    Dash Accounting System v2.0
                    {'\u00a0'}
                    <span className="badge pending-badge">.NET 8</span>
                </Link>


                <NavbarToggler onClick={toggleNavMenu} />

                <Collapse
                    className="d-sm-inline-flex justify-content-between"
                    isOpen={isOpen}
                    navbar
                >
                    {hasSelectedTenant ? (
                        <ul className="navbar-nav nav-underline flex-grow-1">
                            <NavMenuItem
                                currentlyActiveSection={selectedNavigationSection}
                                onClick={goToPage}
                                section={NavigationSection.Dashboard}
                                to="/app/dashboard"
                            >
                                Dashboard
                            </NavMenuItem>

                            <NavMenuItem
                                currentlyActiveSection={selectedNavigationSection}
                                onClick={goToPage}
                                section={NavigationSection.ChartOfAccounts}
                                to="/app/chart-of-accounts"
                            >
                                Chart of Accounts
                            </NavMenuItem>

                            <NavMenuItem
                                currentlyActiveSection={selectedNavigationSection}
                                onClick={goToPage}
                                section={NavigationSection.Ledger}
                                to="/app/ledger"
                            >
                                General Ledger
                            </NavMenuItem>

                            <NavMenuItem
                                currentlyActiveSection={selectedNavigationSection}
                                onClick={goToPage}
                                section={NavigationSection.BalanceSheet}
                                to="/app/balance-sheet"
                            >
                                Balance Sheet
                            </NavMenuItem>

                            <NavMenuItem
                                currentlyActiveSection={selectedNavigationSection}
                                onClick={goToPage}
                                section={NavigationSection.ProfitAndLoss}
                                to="/app/profit-and-loss"
                            >
                                Profit &amp; Loss
                            </NavMenuItem>

                            <NavMenuItem
                                currentlyActiveSection={selectedNavigationSection}
                                onClick={goToPage}
                                section={NavigationSection.TimeTracking}
                                to="/app/time-tracking"
                            >
                                Time Tracking
                            </NavMenuItem>

                            <NavMenuItem
                                currentlyActiveSection={selectedNavigationSection}
                                onClick={goToPage}
                                section={NavigationSection.Invoicing}
                                to="/app/invoicing"
                            >
                                Invoicing
                            </NavMenuItem>
                        </ul>
                    ) : (
                        <div className="flex-grow-1">{' '}</div>
                    )}

                    {/* Right-aligned navigation menu items (Login/Logout/User Profile, etc.) */}
                    <ul className="navbar-nav">
                        {hasUser ? (
                            <React.Fragment>
                                <NavItem>
                                    <NavLink
                                        className="text-dark"
                                        tag={Link}
                                        to="/manage-user-account"
                                    >
                                        {`Hello ${userInfo ? (userInfo.firstName + ' ' + userInfo.lastName) : 'User'}`}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className="text-dark"
                                        tag={Link}
                                        to="/logout"
                                    >
                                        Logout
                                    </NavLink>
                                </NavItem>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <NavItem>
                                    <NavLink
                                        className="text-dark"
                                        tag={Link}
                                        to="/login"
                                    >
                                        Login
                                    </NavLink>
                                </NavItem>
                            </React.Fragment>
                        )}
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
}

export default connector(NavMenu);
