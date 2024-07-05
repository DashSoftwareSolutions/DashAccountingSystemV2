import { isNil } from 'lodash';
import React, { useEffect } from 'react';
import {
    Col,
    Row,
} from 'reactstrap';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    RouteComponentProps,
    withRouter,
} from 'react-router';
import { ApplicationState } from '../../../app/store';
import AmountDisplay from '../../../common/components/amountDisplay';
import Loader from '../../../common/components/loader';
import NavigationSection from '../../../app/navigationSection';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import accountsActions from '../data/accounts.actionCreators';
import { Account } from '../models';

const logger: ILogger = new Logger('Chart of Accounts Page');
const bemBlockName: string = 'chart_of_accounts_page';

const mapStateToProps = (state: ApplicationState) => ({
    accounts: state.accounts.accounts,
    isFetching: state.accounts.isFetching,
    selectedTenant: state.bootstrap.selectedTenant,
});

const mapDispatchToProps = {
    ...accountsActions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ChartOfAccountsPageReduxProps = ConnectedProps<typeof connector>;

type ChartOfAccountsPageProps = ChartOfAccountsPageReduxProps & RouteComponentProps;

function ChartOfAccountsPage(props: ChartOfAccountsPageProps) {
    const {
        accounts,
        history,
        isFetching,
        requestAccounts,
        selectAccount,
        selectedTenant,
    } = props;

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            history.push('/');
        }
    }, [
        history,
        selectedTenant,
    ]);

    useEffect(() => {
        requestAccounts();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onAccountSelected = (account: Account) => {
        logger.info(`Selected Account ${account.accountNumber} - ${account.name}`);
        selectAccount(account);
        history.push('/account-details');
    };

    return (
        <React.Fragment>
            <TenantSubNavigation activeSection={NavigationSection.ChartOfAccounts} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col>
                        <h1>Chart of Accounts</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                {isFetching ? (
                    <Loader />
                ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className="bg-white sticky-top sticky-border">#</th>
                                    <th className="bg-white sticky-top sticky-border">Name</th>
                                    <th className="bg-white sticky-top sticky-border">Type</th>
                                    <th className="bg-white sticky-top sticky-border">Detailed Type</th>
                                    <th className="bg-white sticky-top sticky-border text-end">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts?.map((account: Account) =>
                                    <tr key={account.accountNumber} onClick={() => onAccountSelected(account)} style={{ cursor: 'pointer' }}>
                                        <td>{account.accountNumber}</td>
                                        <td>{account.name}</td>
                                        <td>{account.accountType.name}</td>
                                        <td>{account.accountSubType.name}</td>
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
                )}
            </div>
        </React.Fragment>
    );
}

export default withRouter(connector(ChartOfAccountsPage));
