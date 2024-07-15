import React, { useEffect } from 'react';
import { isNil } from 'lodash';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { InvoiceStatus } from './models';
import { actionCreators as invoiceActionCreators } from './redux';
import { actionCreators as exportActionCreators } from '../../../app/export';
import { RootState } from '../../../app/globalReduxStore';
import Loader from '../../../common/components/loader';
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import useNamedState from '../../../common/utilities/useNamedState';
import usePrevious from '../../../common/utilities/usePrevious';

const logger: ILogger = new Logger('View Invoice Page');
const bemBlockName: string = 'view_invoice_page';

const mapStateToProps = (state: RootState) => ({
    invoice: state.invoice?.details.existingInvoice ?? null,
    isDownloading: state?.exportDownload?.isFetching ?? false,
    isFetching: state.invoice?.details.isFetchingInvoice ?? false,
    pdfDownloadError: state?.exportDownload?.error ?? null,
    pdfDownloadInfo: state?.exportDownload?.downloadInfo ?? null,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...invoiceActionCreators,
    reportDownloadError: exportActionCreators.reportError,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ViewInvoicePageReduxProps = ConnectedProps<typeof connector>;

type ViewInvoicePagePageProps = ViewInvoicePageReduxProps;

function ViewInvoicePage(props: ViewInvoicePagePageProps) {
    const {
        invoice,
        isDownloading,
        isFetching,
        pdfDownloadError,
        pdfDownloadInfo,
        reportDownloadError,
        requestInvoice,
        requestInvoicePdfExport,
        selectedTenant,
    } = props;

    const [isDownloadInProgress, setIsDownloadInProgress] = useNamedState<boolean>('isDownloadInProgress', false);

    const navigate = useNavigate();

    const { invoiceNumber: invoiceNumberParam } = useParams();
    const invoiceNumber = parseInt(invoiceNumberParam ?? '', 10);
    const hasInvoice = !isNil(invoice);

    const wasDownloading = usePrevious(isDownloading);

    useEffect(() => {
        if (isNil(selectedTenant)) {
            logger.info(`No Tenant has been selected.  Navigating to home page...`);
            navigate('/app');
        }
    }, [
        navigate,
        selectedTenant,
    ]);

    // "component did mount" -- fetch the invoice details
    useEffect(() => {
        requestInvoice(invoiceNumber);
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle download
    // TODO: Can it be extracted into a custom hook for reuse?
    useEffect(() => {
        if (wasDownloading && !isDownloading) {
            if (!isNil(pdfDownloadInfo)) {
                fetch(`/api/export-download?filename=${pdfDownloadInfo.fileName}&format=${pdfDownloadInfo.format}&token=${pdfDownloadInfo.token}`)
                    .then((response) => {
                        if (!response.ok) {
                            reportDownloadError(response);
                            setIsDownloadInProgress(false);
                            return null;
                        } else {
                            return response.blob();
                        }
                    })
                    .then((blob) => {
                        if (!isNil(blob)) {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = pdfDownloadInfo.fileName;
                            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again

                            // delay clearing `isDownloadInProgress` flag until save download window pops open
                            setTimeout(() => {
                                setIsDownloadInProgress(false);
                            }, 750);
                        }
                    })
                    .catch((error) => {
                        logger.error('Error:', error);
                        setIsDownloadInProgress(false);
                    });
            } else {
                setIsDownloadInProgress(false);
            }
        }
    }, [
        isDownloading,
        pdfDownloadError,
        pdfDownloadInfo,
        reportDownloadError,
        setIsDownloadInProgress,
        wasDownloading,
    ]);

    const onClickBack = () => { navigate(-1); };

    const onClickDeleteInvoice = () => {
        logger.info('Open modal to confirm deleting the invoice... ');
    };

    const onClickDownloadPdf = () => {
        logger.info('Downloading the PDF Invoice ...');
        requestInvoicePdfExport(invoiceNumber);
        setIsDownloadInProgress(true);
    };

    const onClickEditInvoice = () => {
        logger.info('Editing the invoice...');

        // TODO: Implement edit invoice action
    };

    const onClickReceivePayment = () => {
        logger.info('Open modal to receive payment for the invoice...');
    };

    const onClickSendInvoice = () => {
        logger.info('Open modal to confirm sending the invoice...');
    };

    const onClickViewPayment = () => {
        logger.info('Open modal to view payment info...');
    };

    const isDownloadingAuthoritative = isDownloading || isDownloadInProgress;

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col md={5}>
                        <h1>Invoice Details</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>

                    <Col
                        className="text-end"
                        md={7}
                    >
                        {/* We always get a Back button */}
                        <Button
                            color="secondary"
                            id={`${bemBlockName}--back_button`}
                            onClick={onClickBack}
                            style={{
                                marginRight: 22,
                                width: 88,
                            }}
                        >
                            Back
                        </Button>

                        {/* We always get a Download PDF button */}
                        <Button
                            color="primary"
                            disabled={isDownloadingAuthoritative}
                            id={`${bemBlockName}--download_button`}
                            onClick={onClickDownloadPdf}
                            style={{
                                marginRight: 22,
                                width: 150,
                            }}
                        >
                            {isDownloadingAuthoritative ? 'Downloading...' : 'Download PDF'}
                        </Button>

                        {invoice?.status === InvoiceStatus.Draft && (
                            <React.Fragment>
                                <Button
                                    color="success"
                                    id={`${bemBlockName}--send_button`}
                                    onClick={onClickSendInvoice}
                                    style={{
                                        marginRight: 22,
                                        width: 88,
                                    }}
                                >
                                    Send
                                </Button>

                                <Button
                                    color="primary"
                                    id={`${bemBlockName}--edit_button`}
                                    onClick={onClickEditInvoice}
                                    style={{
                                        marginRight: 22,
                                        width: 88,
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    color="danger"
                                    id={`${bemBlockName}--delete_button`}
                                    onClick={onClickDeleteInvoice}
                                    style={{ width: 88 }}
                                >
                                    Delete
                                </Button>
                            </React.Fragment>
                        )}

                        {invoice?.status === InvoiceStatus.Sent && (
                            <React.Fragment>
                                <Button
                                    color="success"
                                    id={`${bemBlockName}--receive_payment_button`}
                                    onClick={onClickReceivePayment}
                                    style={{ width: 150 }}
                                >
                                    Receive Payment
                                </Button>
                            </React.Fragment>
                        )}

                        {invoice?.status === InvoiceStatus.Paid && (
                            <React.Fragment>
                                <Button
                                    color="success"
                                    id={`${bemBlockName}--view_payment_button`}
                                    onClick={onClickViewPayment}
                                    style={{ width: 150 }}
                                >
                                    View Payment
                                </Button>
                            </React.Fragment>
                        )}
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                {isFetching && (<Loader />)}

                {!isFetching && !hasInvoice && (
                    <div>ERROR: Could not find the Invoice</div>
                )}

                {!isFetching && hasInvoice && (
                    <p>TODO: View Invoice Page content</p>
                )}

                
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(ViewInvoicePage);
