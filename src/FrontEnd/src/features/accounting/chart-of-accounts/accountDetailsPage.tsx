import { isNil } from 'lodash';
import React, { useEffect } from 'react';
import {
    Col,
    Row,
} from 'reactstrap';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    RouteComponentProps,
    withRouter,
} from 'react-router';
import { ApplicationState } from '../../../app/store';
import NavigationSection from '../../../app/navigationSection';
import TenantSubNavigation from '../../../app/tenantSubNavigation';
import AmountDisplay from '../../../common/components/amountDisplay';
import {
    ILogger,
    Logger,
} from '../../../common/logging';

const logger: ILogger = new Logger('Account Details Page');
const bemBlockName: string = 'account_details_page';

const mapStateToProps = (state: ApplicationState) => ({
    selectedAccount: state.accounts.selectedAccount,
    selectedTenant: state.bootstrap.selectedTenant,
});

const connector = connect(mapStateToProps);

type AccountDetailsPageReduxProps = ConnectedProps<typeof connector>;

type AccountDetailsPageProps = AccountDetailsPageReduxProps & RouteComponentProps;

function AccountDetailsPage(props: AccountDetailsPageProps) {
    const {
        history,
        selectedAccount,
        selectedTenant,
    } = props;

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            history.push('/');
            return;
        }

        if (isNil(selectedAccount)) {
            logger.info(`No Account has been selected.  Navigating to Chart of Accounts page...`);
            history.push('/chart-of-accounts');
        }

    }, [
        history,
        selectedAccount,
        selectedTenant,
    ]);

    return (
        <React.Fragment>
            <TenantSubNavigation activeSection={NavigationSection.Ledger} />
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
        </React.Fragment>
    );
}

export default withRouter(connector(AccountDetailsPage));
