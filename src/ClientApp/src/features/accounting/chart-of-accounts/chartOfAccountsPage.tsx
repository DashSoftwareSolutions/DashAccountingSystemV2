import { isNil } from 'lodash';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Col,
    Row,
} from 'reactstrap';
import { Account } from '../models';
import {
    ILogger,
    Logger
} from '../../../common/logging';
import AmountDisplay from '../../../common/components/amountDisplay';
import NavigationSection from '../../../app/navigationSection';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import { selectSelectedTenant } from '../../../app/tenantsSlice';
import { setSelectedAccount } from './accountsSlice';
import { useGetAccountsQuery } from '../api';
import {
    useAppDispatch,
    useTypedSelector,
} from '../../../app/store';

const logger: ILogger = new Logger('Chart of Accounts Page');
const bemBlockName: string = 'chart_of_accounts_page';

function ChartOfAccountsPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const selectedTenant = useTypedSelector(selectSelectedTenant);

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    const onAccountSelected = (account: Account) => {
        logger.info(`Selected Account ${account.accountNumber} - ${account.name}`);
        dispatch(setSelectedAccount(account));
        navigate('/account-details');
    };

    const {
        data: accounts,
        isFetching,
    } = useGetAccountsQuery(selectedTenant?.id ?? '', {
        skip: isNil(selectedTenant),
    });

    return (
        <>
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
                    <div>Loading ...</div>
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
        </>
    );
}

export default ChartOfAccountsPage;
