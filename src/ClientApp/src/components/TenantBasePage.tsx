import * as React from 'react';
import { History } from 'history';
import { isEmpty } from 'lodash';
import Tenant from '../models/Tenant';
import TenantBasePageContent from './TenantBasePageContent';
import TenantBasePageHeader from './TenantBasePageHeader';
import TenantSubNavigation, { NavigationSection } from './TenantSubNavigation';

interface TenantBasePageProps {
    children?: JSX.Element | JSX.Element[];
    history: History;
    section: NavigationSection;
    selectedTenant: Tenant | null;
};

class TenantBasePage extends React.PureComponent<TenantBasePageProps> {
    public static Header = TenantBasePageHeader;
    public static Content = TenantBasePageContent;

    public componentDidMount() {
        const {
            history,
            selectedTenant,
        } = this.props;

        if (isEmpty(selectedTenant)) {
            history.push('/');
        }
    }

    public render() {
        const {
            children,
            section,
            selectedTenant,
        } = this.props;

        if (isEmpty(selectedTenant)) {
            return null;
        }

        return (
            <React.Fragment>
                <TenantSubNavigation activeSection={section} />
                {children}
            </React.Fragment>
        );
    }
}

export default TenantBasePage;