import * as React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../common/Logging';
import { NavigationSection } from './TenantSubNavigation';
import TenantBasePage from './TenantBasePage';

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

const mapDispatchToProps = {
    // TODO: Map needed action creators
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type AddInvoicePageReduxProps = ConnectedProps<typeof connector>;

type AddInvoicePageProps = AddInvoicePageReduxProps
    & RouteComponentProps;

class AddInvoicePage extends React.PureComponent<AddInvoicePageProps> {
    private logger: ILogger;
    private bemBlockName: string = 'add_invoice_page';

    constructor(props: AddInvoicePageProps) {
        super(props);

        this.logger = new Logger('Add Invoice Page');

        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
    }

    public render() {
        const {
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.Invoicing}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col md={6}>
                            <h1>Create New Invoice</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                        <Col md={6} style={{ textAlign: 'right' }}>
                            <Button
                                color="secondary"
                                id={`${this.bemBlockName}--cancel_button`}
                                onClick={this.onClickCancel}
                                style={{ marginRight: 22, width: 88 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                id={`${this.bemBlockName}--save_button`}
                                onClick={this.onClickSave}
                                style={{ width: 88 }}
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <p>Coming Soon...</p>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }

    private onClickCancel() {
        const {
            history,
        } = this.props;

        // TODO: Dispatch reset action

        history.push('/invoicing');
    }

    private onClickSave() {
        this.logger.debug('Saving the invoice...');

        // TODO: Implement save
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(AddInvoicePage as any),
);