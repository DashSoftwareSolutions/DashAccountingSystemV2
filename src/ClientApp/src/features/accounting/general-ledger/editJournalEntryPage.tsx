import { isNil } from 'lodash';
import { useEffect } from 'react';
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

const logger: ILogger = new Logger('Edit Journal Entry Page');
const bemBlockName: string = 'edit_journal_entry_page';

function EditJournalEntryPage() {
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

    const onClickCancel = () => {
        // TODO: Reset dirty Journal Entry Editor Redux state
        navigate('/ledger');
    };

    const onClickSave = () => {
        logger.info('Saving the journal entry...');

        // TODO: Fire the save mutation and then handle success and error responses
    };

    return (
        <>
            <TenantSubNavigation activeSection={NavigationSection.ProfitAndLoss} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={6}>
                        <h1>Edit Journal Entry</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col md={6} style={{ textAlign: 'right' }}>
                        <Button
                            color="secondary"
                            id={`${bemBlockName}--cancel_button`}
                            onClick={onClickCancel}
                            style={{ marginRight: 22, width: 88 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="success"
                            //disabled={isSaving || !canSaveJournalEntry}
                            id={`${bemBlockName}--save_button`}
                            onClick={onClickSave}
                            style={{ width: 88 }}
                        >
                            {/*isSaving ? 'Saving...' : */'Save'}
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

export default EditJournalEntryPage;
