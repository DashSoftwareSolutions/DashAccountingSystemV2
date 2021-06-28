import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import TenantBasePage from './TenantBasePage';
import * as JournalEntryStore from '../store/JournalEntry';

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant ?? null };
}

const mapDispatchToProps = {
    editJournalEntry: JournalEntryStore.actionCreators.editJournalEntry,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type LedgerPageReduxProps = ConnectedProps<typeof connector>;

type LedgerPageProps = LedgerPageReduxProps
    & RouteComponentProps;

class LedgerPage extends React.PureComponent<LedgerPageProps> {
    private bemBlockName: string = 'ledger_page';

    constructor(props: LedgerPageProps) {
        super(props);
        this.onClickEditJournalEntry = this.onClickEditJournalEntry.bind(this);
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
                                <th className="col-md-9">Description</th>
                                <th className="col-md-2" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="col-md-1">1</td>
                                <td className="col-md-9">Foo entry.  Blah blah blah.</td>
                                <td className="col-md-2" style={{ textAlign: 'right' }}>
                                    <Link to={`/journal-entry/view/1`}>View</Link>
                                    <Button
                                        color="link"
                                        onClick={() => this.onClickEditJournalEntry(1)}
                                        style={{
                                            color: '#0366d6',
                                            lineHeight: 1,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            verticalAlign: 'unset',
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="col-md-1">2</td>
                                <td className="col-md-9">Bar entry.  Blah blah blah.</td>
                                <td className="col-md-2" style={{ textAlign: 'right' }}>
                                    <Link to={`/journal-entry/view/2`}>View</Link>
                                    <Button
                                        color="link"
                                        onClick={() => this.onClickEditJournalEntry(2)}
                                        style={{
                                            color: '#0366d6',
                                            lineHeight: 1,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            verticalAlign: 'unset',
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="col-md-1">52</td>
                                <td className="col-md-9">Pending Baz entry.  Blah blah blah.</td>
                                <td className="col-md-2" style={{ textAlign: 'right' }}>
                                    <Link to={`/journal-entry/view/52`}>View</Link>
                                    <Button
                                        color="link"
                                        onClick={() => this.onClickEditJournalEntry(52)}
                                        style={{
                                            color: '#0366d6',
                                            lineHeight: 1,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            verticalAlign: 'unset',
                                        }}
                                    >
                                        Edit
                                    </Button>
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

    private onClickEditJournalEntry(entryId: number) {
        const {
            editJournalEntry,
            history,
        } = this.props;

        editJournalEntry();
        history.push(`/journal-entry/edit/${entryId}`);
    }
}

export default withRouter(
    connector(LedgerPage as any),
);