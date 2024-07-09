import classNames from 'classnames';
import { NavItem } from 'reactstrap';
import { NavigationSection } from '../common/models';
import LinkButton from '../common/components/linkButton';

type PropTypes = {
    children: React.ReactNode;
    currentlyActiveSection: NavigationSection | null; 
    onClick: (navigationSection: NavigationSection, path: string) => void;
    section: NavigationSection;
    to: string;
}

function NavMenuItem({
    children,
    currentlyActiveSection,
    onClick,
    section,
    to,
}: PropTypes) {
    const handleClick = () => onClick(section, to);

    return (
        <NavItem>
            <LinkButton
                className={classNames('nav-link', 'app-nav-link', 'text-dark', { active: currentlyActiveSection === section })}
                onClick={handleClick}
            >
                {children}
            </LinkButton>
        </NavItem>
    );
}

export default NavMenuItem;
