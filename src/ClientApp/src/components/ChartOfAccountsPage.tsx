import * as React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { Jumbotron } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import Account from '../models/Account';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
import TenantSubNavigation, { NavigationSection } from './TenantSubNavigation';
import * as AccountsStore from '../store/Accounts';

interface ChartOfAccountsPageReduxProps extends AccountsStore.AccountsState {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return {
        ...state.accounts,
        selectedTenant: state.tenants?.selectedTenant,
    };
}

type ChartOfAccountsPageProps = ChartOfAccountsPageReduxProps
    & typeof AccountsStore.actionCreators
    & RouteComponentProps;

class ChartOfAccountsPage extends React.PureComponent<ChartOfAccountsPageProps> {
    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate() {
        this.ensureDataFetched();

        const {
            history,
            selectedAccount,
        } = this.props;

        if (!isEmpty(selectedAccount)) {
            history.push('/account-details');
        }
    }

    public render() {
        const {
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage selectedTenant={selectedTenant}>
                <Jumbotron>
                    <h1>Chart of Accounts</h1>
                    <p className="lead">{selectedTenant?.name}</p>
                </Jumbotron>
                <TenantSubNavigation activeSection={NavigationSection.ChartOfAccounts} />
                {this.renderAccountsTable()}
            </TenantBasePage>
        );
    }

    private ensureDataFetched() {
        const { requestAccounts } = this.props;
        requestAccounts();
    }

    private renderAccountsTable() {
        const {
            selectAccount,
            accounts,
        } = this.props;

        if (isEmpty(accounts)) {
            return null;
        }

        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th style={{ textAlign: 'right' }}>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account: Account) =>
                        <tr key={account.accountNumber} onClick={() => selectAccount(account)} style={{ cursor: 'pointer' }}>
                            <td>{account.accountNumber}</td>
                            <td>{account.name}</td>
                            <td>{account.accountType.name}</td>
                            <td style={{ textAlign: 'right' }}>
                                {/* TODO/FIXME: Be aware of asset type and user locale */}
                                {Math.abs(account.balance.amount ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2})}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        AccountsStore.actionCreators, // map dispatch to props
    )(ChartOfAccountsPage as any),
);