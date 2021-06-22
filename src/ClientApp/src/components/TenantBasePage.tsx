import * as React from 'react';
import { isEmpty } from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import Tenant from '../models/Tenant';

interface TenantBasePageOwnProps {
    selectedTenant: Tenant | null,
};

type TenantBasePageProps = TenantBasePageOwnProps
    & RouteComponentProps;

class TenantBasePage extends React.PureComponent<TenantBasePageProps> {
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
            selectedTenant,
        } = this.props;

        if (isEmpty(selectedTenant)) {
            return null;
        }

        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
}

export default withRouter(TenantBasePage);