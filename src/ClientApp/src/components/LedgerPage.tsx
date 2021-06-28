import * as React from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';

interface LedgerPageReduxProps {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type LedgerPageProps = LedgerPageReduxProps
    & RouteComponentProps;

class LedgerPage extends React.PureComponent<LedgerPageProps> {
    private bemBlockName: string = 'ledger_page';

    constructor(props: LedgerPageProps) {
        super(props);
        this.onClickNewJournalEntry = this.onClickNewJournalEntry.bind(this);
    }

    public render() {
        const {
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Ledger}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col md={6}>
                            <h1>General Ledger</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button color="primary" onClick={this.onClickNewJournalEntry}>
                                New Journal Entry
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    {/* TEMP FOR TESTING */}
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th className="col-md-1">ID</th>
                                <th className="col-md-10">Description</th>
                                <th className="col-md-1" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="col-md-1">1</td>
                                <td className="col-md-10">Foo entry.  Blah blah blah.</td>
                                <td className="col-md-1">
                                    <Link to={`/journal-entry/view/1`}>View</Link>
                                </td>
                            </tr>
                            <tr>
                                <td className="col-md-1">2</td>
                                <td className="col-md-10">Bar entry.  Blah blah blah.</td>
                                <td className="col-md-1">
                                    <Link to={`/journal-entry/view/2`}>View</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private onClickNewJournalEntry() {
        const { history } = this.props;
        history.push('/journal-entry/new');
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(LedgerPage as any),
);