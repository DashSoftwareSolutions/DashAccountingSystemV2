import { isNil } from 'lodash';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Col,
    Row,
} from 'reactstrap';
import {
    ILogger,
    Logger
} from '../../../common/logging';
import NavigationSection from '../../../app/navigationSection';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import { selectSelectedTenant } from '../../../app/tenantsSlice';
import {
    useTypedSelector,
} from '../../../app/store';

const logger: ILogger = new Logger('Chart of Accounts Page');
const bemBlockName: string = 'chart_of_accounts_page';

function ChartOfAccountsPage() {
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
                <p>Coming soon...</p>
            </div>
        </>
    );
}

export default ChartOfAccountsPage;