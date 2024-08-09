import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Col,
    Row,
} from 'reactstrap';
import { RootState } from '../../../app/globalReduxStore';
import AmountDisplay from '../../../common/components/amountDisplay';
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';

const logger: ILogger = new Logger('Account Details Page');
const bemBlockName: string = 'account_details_page';

const mapStateToProps = (state: RootState) => ({
    selectedAccount: state.chartOfAccounts.selectedAccount,
    selectedTenant: state.application.selectedTenant,
});

const connector = connect(mapStateToProps);

type AccountDetailsPageReduxProps = ConnectedProps<typeof connector>;

type AccountDetailsPageProps = AccountDetailsPageReduxProps;

function AccountDetailsPage(props: AccountDetailsPageProps) {
    const {
        selectedAccount,
        selectedTenant,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
            return;
        }

        if (isNil(selectedAccount)) {
            logger.info(`No Account has been selected.  Navigating to Chart of Accounts page...`);
            navigate('/app/chart-of-accounts');
        }

    }, [
        navigate,
        selectedAccount,
        selectedTenant,
    ]);

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
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

            <MainPageContent id={`${bemBlockName}--content`}>
                <p>Coming soon...</p>
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(AccountDetailsPage);
