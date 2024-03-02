import {
    isFinite,
    isNil,
} from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import {
    ILogger,
    Logger
} from '../../../common/logging';
import JournalEntryDetails from './journalEntryDetails';
import NavigationSection from '../../../app/navigationSection';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import { selectSelectedTenant } from '../../../app/tenantsSlice';
import { useGetJournalEntryQuery } from '../api';
import {
    useTypedSelector,
} from '../../../app/store';

const logger: ILogger = new Logger('View Journal Entry Page');
const bemBlockName: string = 'view_journal_entry_page';

function ViewJournalEntryPage() {
    const navigate = useNavigate();
    const selectedTenant = useTypedSelector(selectSelectedTenant);
    const { entryId: entryIdParam } = useParams();

    const entryId = parseInt(entryIdParam ?? '', 10);
    const hasValidEntryId = isFinite(entryId) && entryId > 0;

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    const onClickBack = () => {
        navigate(-1);
    };

    const { isFetching, data: journalEntry } = useGetJournalEntryQuery({ tenantId: selectedTenant?.id ?? '', entryId }, {
        skip: isNil(selectedTenant) || !hasValidEntryId,
    });

    return (
        <>
            <TenantSubNavigation activeSection={NavigationSection.Ledger} />
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col md={5}>
                        <h1>Journal Entry Details</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                    <Col className="text-end" md={7}>
                        <Button
                            color="secondary"
                            id={`${bemBlockName}--back_button`}
                            onClick={onClickBack}
                            style={{ marginRight: 22, width: 120 }}
                        >
                            Back
                        </Button>
                    </Col>
                </Row>
            </div>
            <div id={`${bemBlockName}--content`}>
                {isFetching ? (
                    <div>Loading ...</div>
                ): (
                    <JournalEntryDetails bemBlockName={bemBlockName} journalEntry={journalEntry} />
                )}
            </div>
        </>
    );
}

export default ViewJournalEntryPage;
