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
} from '../../common/logging';
import NavigationSection from '../../app/navigationSection';
import TenantSubNavigation from '../../app/tenantSubNavigation';
import { selectSelectedTenant } from '../../app/tenantsSlice';
import {
    useTypedSelector,
} from '../../app/store';

const logger: ILogger = new Logger('Invoice List Page');
const bemBlockName: string = 'invoice_list_page';

function InvoiceListPage() {
    const navigate = useNavigate();
    const selectedTenant = useTypedSelector(selectSelectedTenant);

    const onClickCreateInvoice = useCallback(() => {
        logger.info('Create Invoice button clicked!');
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
            <TenantSubNavigation activeSection={NavigationSection.Invoicing} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={6}>
                        <h1>Invoices</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col md={6} style={{ textAlign: 'right' }}>
                        <Button color="primary" onClick={onClickCreateInvoice}>
                            Create Invoice
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

export default InvoiceListPage;