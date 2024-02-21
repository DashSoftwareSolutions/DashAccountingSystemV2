import {
    useCallback,
    useState,
} from 'react';
import {
    Collapse,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
} from 'reactstrap';
import './nav-menu.css';

function NavMenu() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleNavMenu = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3" light>
                <NavbarBrand to="/">Dash Accounting System v2.0</NavbarBrand>
                <NavbarToggler onClick={toggleNavMenu} />
                <Collapse className="d-sm-inline-flex justify-content-between" isOpen={isOpen} navbar>
                    <ul className="navbar-nav flex-grow-1">
                        <NavItem>
                            <NavLink className="text-dark" href="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="text-dark" href="/Home/Privacy">Privacy</NavLink>
                        </NavItem>
                    </ul>
                    <ul className="navbar-nav">
                        <NavItem>
                            {/* TODO: Get the user's name! */}
                            <NavLink className="text-dark" href="/Identity/Account/Manage">Hello User</NavLink>
                        </NavItem>
                        <NavItem>
                            <form className="form-inline" id="logoutForm" action="/Identity/Account/Logout" method="POST">
                                <button id="logout" type="submit" className="nav-link btn btn-link text-dark border-0">Logout</button>
                            </form>
                        </NavItem>
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
}

export default NavMenu;
