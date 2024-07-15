import React, { useEffect } from 'react';
import {
    isEmpty,
    isNil,
} from 'lodash';
import { DateTime } from 'luxon';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { InvoiceLite } from './models';
import { actionCreators as invoiceActionCreators } from './redux';
import { RootState } from '../../../app/globalReduxStore';
import AmountDisplay from '../../../common/components/amountDisplay';
import LinkButton from '../../../common/components/linkButton';
import Loader from '../../../common/components/loader';
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';

const logger: ILogger = new Logger('Invoice List Page');
const bemBlockName: string = 'invoice_list_page';

const mapStateToProps = (state: RootState) => ({
    invoiceList: state.invoice?.list.results,
    isFetching: state.invoice?.list.isFetching,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...invoiceActionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type InvoiceListPageReduxProps = ConnectedProps<typeof connector>;

type InvoiceListPageProps = InvoiceListPageReduxProps;

function InvoiceListPage(props: InvoiceListPageProps) {
    const {
        initializeNewInvoice,
        invoiceList,
        isFetching,
        requestInvoiceList,
        selectedTenant,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    // component did mount - fetch the data
    useEffect(() => {
        requestInvoiceList();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickCreateInvoice = () => {
        initializeNewInvoice();
        navigate('/app/invoice/new');
    };

    const onClickExistingInvoice = (invoice: InvoiceLite) => {
        navigate(`/app/invoice/view/${invoice.invoiceNumber}`);
    };

    const hasInvoices = !isEmpty(invoiceList) && !isEmpty(invoiceList.results);

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col md={6}>
                        <h1>Invoices</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>

                    <Col
                        className="text-end"
                        md={6}
                    >
                        <Button
                            color="primary"
                            onClick={onClickCreateInvoice}
                        >
                            Create Invoice
                        </Button>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                {isFetching && (
                    <Loader />
                )}

                {!isFetching && !hasInvoices && (
                    <p>There are currently no invoices in the system.</p>
                )}

                {!isFetching && hasInvoices && (
                    <table className="table table-hover table-sm report-table">
                        <thead>
                            <tr>
                                <th className="col-md-1 bg-white sticky-top sticky-border">{'Invoice\u00A0Date'}</th>
                                <th className="col-md-1 bg-white sticky-top sticky-border">Invoice #</th>
                                <th className="col-md-3 bg-white sticky-top sticky-border">Customer</th>
                                <th className="col-md-2 bg-white sticky-top sticky-border text-end">Amount</th>
                                <th className="col-md-2 bg-white sticky-top sticky-border">Status</th>
                                <th className="col-md-1 bg-white sticky-top sticky-border">Due</th>
                                <th className="col-md-1 bg-white sticky-top sticky-border">&nbsp;</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoiceList.results.map((invoice) => ((
                                <tr key={invoice.id}>
                                    <td className="col-md-1">
                                        <LinkButton
                                            className="btn-link-report-item"
                                            onClick={() => onClickExistingInvoice(invoice)}
                                        >
                                            {DateTime.fromISO(invoice.issueDate).toLocaleString(DateTime.DATE_SHORT)}
                                        </LinkButton>
                                    </td>
                                    <td className="col-md-1">
                                        <LinkButton
                                            className="btn-link-report-item"
                                            onClick={() => onClickExistingInvoice(invoice)}
                                        >
                                            {invoice.invoiceNumber}
                                        </LinkButton>
                                    </td>
                                    <td className="col-md-3">
                                        <LinkButton
                                            className="btn-link-report-item"
                                            onClick={() => onClickExistingInvoice(invoice)}
                                        >
                                            {invoice.customerName}
                                        </LinkButton>
                                    </td>
                                    <td className="col-md-2 text-end">
                                        <LinkButton
                                            className="btn-link-report-item"
                                            onClick={() => onClickExistingInvoice(invoice)}
                                        >
                                            <AmountDisplay
                                                amount={invoice.amount}
                                                showCurrency
                                            />
                                        </LinkButton>
                                    </td>
                                    <td className="col-md-2">
                                        <LinkButton
                                            className="btn-link-report-item"
                                            onClick={() => onClickExistingInvoice(invoice)}
                                        >
                                            {invoice.status}
                                        </LinkButton>
                                    </td>
                                    <td className="col-md-1">
                                        <LinkButton
                                            className="btn-link-report-item"
                                            onClick={() => onClickExistingInvoice(invoice)}
                                        >
                                            {DateTime.fromISO(invoice.dueDate).toLocaleString(DateTime.DATE_SHORT)}
                                        </LinkButton>
                                    </td>
                                    <td>
                                        &nbsp;
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                )}
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(InvoiceListPage);
