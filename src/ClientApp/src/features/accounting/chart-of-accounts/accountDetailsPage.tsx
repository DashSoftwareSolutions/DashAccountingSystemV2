import { isNil } from 'lodash';
import {
    useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Col,
    Row,
} from 'reactstrap';
import {
    ILogger,
    Logger
} from '../../../common/logging';
import AmountDisplay from '../../../common/components/amountDisplay';
import NavigationSection from '../../../app/navigationSection';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import { selectSelectedAccount } from '../accountsSlice';
import { selectSelectedTenant } from '../../../app/tenantsSlice';
import {
    useTypedSelector,
} from '../../../app/store';

const logger: ILogger = new Logger('Account Details Page');
const bemBlockName: string = 'account_details_page';

function AccountDetailsPage() {
    const navigate = useNavigate();
    const selectedTenant = useTypedSelector(selectSelectedTenant);
    const selectedAccount = useTypedSelector(selectSelectedAccount);

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/');
        }

        if (isNil(selectedAccount)) {
            logger.info(`No Account has been selected.  Navigating to Chart of Accounts page...`);
            navigate('/chart-of-accounts');
        }
    }, [
        navigate,
        selectedAccount,
        selectedTenant,
    ]);

    return (
        <>
            <TenantSubNavigation activeSection={NavigationSection.ChartOfAccounts} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                {isNil(selectedAccount) ? (<></>) : (
                    <Row>
                        <Col>
                            <h1>{`${selectedAccount.accountNumber} - ${selectedAccount.name}`}</h1>
                            <p className="lead">{selectedAccount.accountType.name}</p>
                            <p className="lead">
                                <AmountDisplay
                                    amount={selectedAccount.balance}
                                    normalBalanceType={selectedAccount.normalBalanceType}
                                    showCurrency
                                />
                            </p>
                        </Col>
                    </Row>
                )}
            </div>
            <div id={`${bemBlockName}--content`}>
                <p>Coming soon...</p>
            </div>
        </>
    );
}

export default AccountDetailsPage;