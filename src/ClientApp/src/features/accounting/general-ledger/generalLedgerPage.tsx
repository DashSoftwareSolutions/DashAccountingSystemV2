import { isNil } from 'lodash';
import {
    useCallback,
    useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
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

const logger: ILogger = new Logger('General Ledger Page');
const bemBlockName: string = 'general_ledger_page';

function GeneralLedgerPage() {
    const navigate = useNavigate();
    const selectedTenant = useTypedSelector(selectSelectedTenant);

    const onClickNewJournalEntry = useCallback(() => {
        logger.info('New Journal Entry button clicked!');
    }, []);

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
            <TenantSubNavigation activeSection={NavigationSection.Ledger} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={6}>
                        <h1>General Ledger</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col md={6} style={{ textAlign: 'right' }}>
                        <Button color="primary" onClick={onClickNewJournalEntry}>
                            New Journal Entry
                        </Button>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                <p>Coming soon...</p>
            </div>
        </>
    );
}

export default GeneralLedgerPage;