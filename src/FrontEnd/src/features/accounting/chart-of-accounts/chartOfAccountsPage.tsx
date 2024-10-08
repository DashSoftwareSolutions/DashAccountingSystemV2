import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Col,
    Row,
} from 'reactstrap';
import { Account } from './models';
import accountsActions from './redux/accounts.actionCreators';
import { RootState } from '../../../app/globalReduxStore';
import AmountDisplay from '../../../common/components/amountDisplay';
import Loader from '../../../common/components/loader';
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';

const logger: ILogger = new Logger('Chart of Accounts Page');
const bemBlockName: string = 'chart_of_accounts_page';

const mapStateToProps = (state: RootState) => ({
    accounts: state.chartOfAccounts.accounts,
    isFetching: state.chartOfAccounts.isFetching,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...accountsActions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ChartOfAccountsPageReduxProps = ConnectedProps<typeof connector>;

type ChartOfAccountsPageProps = ChartOfAccountsPageReduxProps;

function ChartOfAccountsPage(props: ChartOfAccountsPageProps) {
    const {
        accounts,
        isFetching,
        requestAccounts,
        selectAccount,
        selectedTenant,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        navigate,
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
        navigate('/app/account-details');
    };

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col>
                        <h1>Chart of Accounts</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
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
                                <tr key={account.accountNumber}
                                    onClick={() => onAccountSelected(account)}
                                    style={{ cursor: 'pointer' }}>
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
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(ChartOfAccountsPage);
