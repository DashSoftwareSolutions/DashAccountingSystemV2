import './navMenu.css';

import React, {
    useCallback,
} from 'react';
import { isEmpty } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavItem,
    NavLink,
} from 'reactstrap';
import { RootState } from './globalReduxStore';
import { UserLite } from '../common/models';
import useNamedState from '../common/utilities/useNamedState';

const mapStateToProps = (state: RootState) => ({
    isLoggedIn: state.authentication.isLoggedIn,

    selectedTenant: state.application.selectedTenant,
    userInfo: state.application.userInfo,
});

const connector = connect(mapStateToProps);

type PropTypes = ConnectedProps<typeof connector>;

function NavMenu({
    userInfo,
    selectedTenant,
}: PropTypes) {
    const [isOpen, setIsOpen] = useNamedState<boolean>('isOpen', false);

    const toggleNavMenu = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3" light>
                <Link className="navbar-brand" to="/">
                    Dash Accounting System v2.0
                    {'\u00a0'}
                    <span className="badge pending-badge">.NET 8</span>
                </Link>


                <NavbarToggler onClick={toggleNavMenu} />

                <Collapse className="d-sm-inline-flex justify-content-between" isOpen={isOpen} navbar>
                    {/* Left-aligned navigation menu items */}
                    {/*<ul className="navbar-nav flex-grow-1">*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink className="text-dark" tag={Link} to="/">Home</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*    <NavItem>*/}
                    {/*        <NavLink className="text-dark" tag={Link} to="/privacy">Privacy</NavLink>*/}
                    {/*    </NavItem>*/}
                    {/*</ul>*/}
                    <div className="flex-grow-1">
                        
                    </div>

                    {/* Right-aligned navigation menu items (Login/Logout/User Profile, etc.) */}
                    <ul className="navbar-nav">
                        {!isEmpty(userInfo?.id) ? (
                            <React.Fragment>
                                <NavItem>
                                    <NavLink className="text-dark" tag={Link} to="/manage-user-account">{`Hello ${userInfo ? (userInfo.firstName + ' ' + userInfo.lastName) : 'User'}`}</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="text-dark" tag={Link} to="/logout">Logout</NavLink>
                                </NavItem>
                            </React.Fragment>
                        ): (
                            <React.Fragment>
                                <NavItem>
                                    <NavLink className="text-dark" tag={Link} to="/login">Login</NavLink>
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
