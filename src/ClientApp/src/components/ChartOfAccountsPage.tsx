﻿import * as React from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import Account from '../models/Account';
import AmountDisplay from '../components/AmountDisplay';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';
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
    private bemBlockName: string = 'chart_of_accounts_page';

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
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.ChartOfAccounts}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col>
                            <h1>Chart of Accounts</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    {this.renderAccountsTable()}
                </TenantBasePage.Content>
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
            return (<React.Fragment />);
        }

        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="bg-white sticky-top sticky-border">#</th>
                        <th className="bg-white sticky-top sticky-border">Name</th>
                        <th className="bg-white sticky-top sticky-border">Type</th>
                        <th className="bg-white sticky-top sticky-border text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account: Account) =>
                        <tr key={account.accountNumber} onClick={() => selectAccount(account)} style={{ cursor: 'pointer' }}>
                            <td>{account.accountNumber}</td>
                            <td>{account.name}</td>
                            <td>{account.accountType.name}</td>
                            <td style={{ textAlign: 'right' }}>
                                <AmountDisplay
                                    amount={account.balance}
                                    normalBalanceType={account.normalBalanceType}
                                    showCurrency
                                />
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