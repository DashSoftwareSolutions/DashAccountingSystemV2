import * as React from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import Account from '../models/Account';
import AmountDisplay from './AmountDisplay';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';

interface AccountDetailsPageReduxProps {
    selectedAccount: Account | null;
    selectedTenant: Tenant | null;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedAccount: state.accounts?.selectedAccount,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

type AccountDetailsPageProps = AccountDetailsPageReduxProps
    & RouteComponentProps;

class AccountDetailsPage extends React.PureComponent<AccountDetailsPageProps> {
    private bemBlockName: string = 'account_details_page';

    public componentDidMount() {
        const {
            history,
            selectedAccount,
        } = this.props;

        if (isNil(selectedAccount)) {
            history.push('/chart-of-accounts');
        }
    }

    public render() {
        const {
            history,
            selectedAccount,
            selectedTenant,
        } = this.props;

        if (isNil(selectedAccount)) {
            return null;
        }

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.ChartOfAccounts}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col>
                            <h1>{`${selectedAccount?.accountNumber} - ${selectedAccount?.name}`}</h1>
                            <p className="lead">{selectedAccount?.accountType.name}</p>
                            <p className="lead">
                                <AmountDisplay
                                    amount={selectedAccount?.balance}
                                    normalBalanceType={selectedAccount.normalBalanceType}
                                    showCurrency
                                />
                            </p>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <p>Coming Soon...</p>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(AccountDetailsPage as any),
);