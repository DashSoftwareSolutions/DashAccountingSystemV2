import * as React from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '../store';
import { NavigationSection } from './TenantSubNavigation';
import Tenant from '../models/Tenant';
import TenantBasePage from './TenantBasePage';

interface ProfitAndLossPageReduxProps {
    selectedTenant: Tenant | null;
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedTenant: state.tenants?.selectedTenant };
}

type ProfitAndLossPageProps = ProfitAndLossPageReduxProps
    & RouteComponentProps;

class ProfitAndLossPage extends React.PureComponent<ProfitAndLossPageProps> {
    private bemBlockName: string = 'profit_and_loss_page';

    public render() {
        const {
            history,
            selectedTenant,
        } = this.props;

        return (
            <TenantBasePage
                history={history}
                section={NavigationSection.ProfitAndLoss}
                selectedTenant={selectedTenant}
            >
                <TenantBasePage.Header id={`${this.bemBlockName}--header`}>
                    <Row>
                        <Col>
                            <h1>Profit &amp; Loss</h1>
                            <p className="lead">{selectedTenant?.name}</p>
                        </Col>
                    </Row>
                </TenantBasePage.Header>
                <TenantBasePage.Content id={`${this.bemBlockName}--content`}>
                    <p>Coming Soon...</p>
                </TenantBasePage.Content>
            </TenantBasePage>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
    )(ProfitAndLossPage as any),
);