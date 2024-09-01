import React, {
    useCallback,
    useEffect,
} from 'react';
import { isNil } from 'lodash';
import { DateTime } from 'luxon';
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
    ListGroup,
    ListGroupItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
} from 'reactstrap';
import InvoiceLineItemsTable from './invoiceLineItemsTable';
import InvoiceStatusLabel from './invoiceStatusLabel';
import { InvoiceStatus } from './models';
import { actionCreators as invoiceActionCreators } from './redux';
import { actionCreators as exportActionCreators } from '../../../app/export';
import { RootState } from '../../../app/globalReduxStore';
import {
    actionCreators as notificationActionCreators,
    NotificationLevel,
} from '../../../app/notifications';
import AmountDisplay from '../../../common/components/amountDisplay';
import Loader from '../../../common/components/loader';
import MainPageContent from '../../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import useNamedState from '../../../common/utilities/useNamedState';
import usePrevious from '../../../common/utilities/usePrevious';
import ReceivePaymentModalDialog from '../payments/receivePaymentModalDialog';
import { actionCreators as paymentActionCreators } from '../payments/redux';

const logger: ILogger = new Logger('View Invoice Page');
const bemBlockName: string = 'view_invoice_page';

const mapStateToProps = (state: RootState) => ({
    invoice: state.invoice?.details.existingInvoice ?? null,
    isDeleting: state.invoice?.details.isDeleting ?? false,
    isDownloading: state?.exportDownload?.isFetching ?? false,
    isFetching: state.invoice?.details.isFetchingInvoice ?? false,
    isSaving: state.invoice?.details.isSaving ?? false,
    isSavingPayment: state.payments?.isSaving ?? false,
    pdfDownloadError: state?.exportDownload?.error ?? null,
    pdfDownloadInfo: state?.exportDownload?.downloadInfo ?? null,
    savedPayment: state.payments?.existingPayment ?? null,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...invoiceActionCreators,
    initializeNewPayment: paymentActionCreators.initializeNewPayment,
    reportDownloadError: exportActionCreators.reportError,
    resetPaymentStore: paymentActionCreators.reset,
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ViewInvoicePageReduxProps = ConnectedProps<typeof connector>;

type PropTypes = ViewInvoicePageReduxProps;

function ViewInvoicePage(props: PropTypes) {
    const {
        deleteInvoice,
        initializeNewPayment,
        invoice,
        isDeleting,
        isDownloading,
        isFetching,
        isSaving,
        isSavingPayment,
        pdfDownloadError,
        pdfDownloadInfo,
        reportDownloadError,
        requestInvoice,
        requestInvoicePdfExport,
        reset,
        resetExistingInvoice,
        resetInvoiceList,
        resetPaymentStore,
        savedPayment,
        selectedTenant,
        sendInvoice,
        showAlert,
    } = props;

    const [isConfirmDeleteInvoiceModalOpen, setIsConfirmDeleteInvoiceModalOpen] = useNamedState<boolean>('isConfirmDeleteInvoiceModalOpen', false);
    const [isConfirmSendInvoiceModalOpen, setIsConfirmSendInvoiceModalOpen] = useNamedState<boolean>('isConfirmSendInvoiceModalOpen', false);
    const [isDownloadInProgress, setIsDownloadInProgress] = useNamedState<boolean>('isDownloadInProgress', false);
    const [isReceivePaymentModalOpen, setIsReceivePaymentModalOpen] = useNamedState<boolean>('isReceivePaymentModalOpen', false);
    const [isViewPaymentModalOpen, setIsViewPaymentModalOpen] = useNamedState<boolean>('isViewPaymentModalOpen', false);

    const navigate = useNavigate();

    const { invoiceNumber: invoiceNumberParam } = useParams();
    const invoiceNumber = parseInt(invoiceNumberParam ?? '', 10);
    const hasInvoice = !isNil(invoice);

    const wasDeleting = usePrevious(isDeleting);
    const wasDownloading = usePrevious(isDownloading);
    const wasSaving = usePrevious(isSaving);
    const wasSavingPayment = usePrevious(isSavingPayment);

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

    useEffect(() => {
        if (wasSaving &&
            !isSaving &&
            !isNil(invoice)) {
            setIsConfirmSendInvoiceModalOpen(false);
            showAlert(NotificationLevel.Success, `Successfully updated Invoice # ${invoiceNumber} from 'Draft' to 'Sent'`, true);
            resetInvoiceList();
        }
    }, [
        invoice,
        invoiceNumber,
        isSaving,
        resetInvoiceList,
        setIsConfirmSendInvoiceModalOpen,
        showAlert,
        wasSaving,
    ]);

    useEffect(() => {
        if (wasDeleting && !isDeleting) {
            setIsConfirmDeleteInvoiceModalOpen(false);
            showAlert(NotificationLevel.Success, `Successfully deleted Invoice # ${invoiceNumber}`, true);
            reset();
            navigate('/app/invoicing');
        }
    }, [
        invoiceNumber,
        isDeleting,
        navigate,
        reset,
        setIsConfirmDeleteInvoiceModalOpen,
        showAlert,
        wasDeleting,
    ]);

    useEffect(() => {
        if (wasSavingPayment &&
            !isSavingPayment &&
            !isNil(savedPayment)) {
            showAlert(NotificationLevel.Success, `Successfully recorded payment for Invoice # ${invoiceNumber}`, true);
            resetPaymentStore();
            resetExistingInvoice();
            resetInvoiceList();
            requestInvoice(invoiceNumber); // re-fetch the Invoice details so it now shows Paid status
        }
    }, [
        invoiceNumber,
        isSavingPayment,
        requestInvoice,
        resetExistingInvoice,
        resetInvoiceList,
        resetPaymentStore,
        savedPayment,
        showAlert,
        wasSavingPayment,
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

    const onClickReceivePayment = useCallback(() => {
        if (!isNil(invoice)) {
            initializeNewPayment(invoice);
            setIsReceivePaymentModalOpen(true);
        }
    }, [
        initializeNewPayment,
        invoice,
        setIsReceivePaymentModalOpen,
    ]);

    const onClickSendInvoice = () => {
        setIsConfirmSendInvoiceModalOpen(true);
    };

    const onClickViewPayment = () => {
        setIsViewPaymentModalOpen(true);
    };

    const onCloseReceivePaymentModal = () => {
        setIsReceivePaymentModalOpen(false);
    };

    const onCloseViewPaymentModal = () => {
        setIsViewPaymentModalOpen(false);
    };

    const onDeleteInvoiceConfirmed = () => {
        logger.info('We\'re sure we want to delete the invoice.  Doing it...');
        deleteInvoice();
    };

    const onDeleteInvoiceDeclined = () => {
        setIsConfirmDeleteInvoiceModalOpen(false);
    };

    const onSendInvoiceConfirmed = () => {
        sendInvoice();
    };

    const onSendInvoiceDeclined = () => {
        setIsConfirmSendInvoiceModalOpen(false);
    };

    const renderInvoice = useCallback((): JSX.Element => {
        if (!hasInvoice) {
            return (<React.Fragment />);
        }

        const issueDate = DateTime.fromISO(invoice.issueDate ?? '');
        const dueDate = DateTime.fromISO(invoice.dueDate ?? '');
        const isPastDue = dueDate.startOf('day') < DateTime.now().startOf('day');

        return (
            <React.Fragment>
                <ListGroup>
                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Invoice #</strong></Col>
                            <Col md={2}>{invoice.invoiceNumber}</Col>
                            <Col md={2}><strong>Amount</strong></Col>
                            <Col md={2}>
                                {!isNil(invoice.amount) && (
                                    <AmountDisplay
                                        amount={invoice.amount}
                                        showCurrency
                                    />
                                )}
                            </Col>
                            <Col md={2}><strong>Status</strong></Col>
                            <Col md={2}>
                                <InvoiceStatusLabel
                                    isPastDue={isPastDue}
                                    status={invoice.status}
                                />
                            </Col>
                        </Row>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Issue Date</strong></Col>
                            <Col md={2}>{issueDate.toFormat('MM/dd/yyyy')}</Col>
                            <Col md={2}><strong>Terms</strong></Col>
                            <Col md={2}>{invoice.invoiceTerms?.name}</Col>
                            <Col md={2}><strong>Due Date</strong></Col>
                            <Col md={2}>{dueDate.toFormat('MM/dd/yyyy')}</Col>
                        </Row>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Customer</strong></Col>
                            <Col md={10}>{invoice.customer?.displayName}</Col>
                        </Row>
                    </ListGroupItem>

                    <ListGroupItem>
                        <Row>
                            <Col md={2}><strong>Message</strong></Col>

                            <Col md={10}>
                                {!isNil(invoice.message) && (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: invoice.message.replace(/\n/g, '<br />'),
                                        }}
                                    />
                                )}
                            </Col>
                        </Row>
                    </ListGroupItem>
                </ListGroup>

                <div style={{ marginTop: 22 }}>
                    <InvoiceLineItemsTable lineItems={invoice.lineItems} />
                </div>
            </React.Fragment>
        );
    }, [
        hasInvoice,
        invoice,
    ]);

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
                    <React.Fragment>
                        {renderInvoice()}
                    </React.Fragment>
                )}

                <Modal
                    backdrop="static"
                    id={`${bemBlockName}--delete_confirm_modal`}
                    isOpen={isConfirmDeleteInvoiceModalOpen}
                    toggle={onDeleteInvoiceDeclined}
                >
                    <ModalHeader toggle={onDeleteInvoiceDeclined}>Delete Invoice</ModalHeader>

                    <ModalBody>
                        This action cannot be undone.  Are you sure?
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="danger"
                            disabled={isDeleting}
                            onClick={onDeleteInvoiceConfirmed}
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete It'}
                        </Button>
                        {' '}
                        <Button
                            color="secondary"
                            disabled={isDeleting}
                            onClick={onDeleteInvoiceDeclined}
                        >
                            No, Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    backdrop="static"
                    id={`${bemBlockName}--send_invoice_confirm_modal`}
                    isOpen={isConfirmSendInvoiceModalOpen}
                    toggle={onSendInvoiceDeclined}
                >
                    <ModalHeader toggle={onSendInvoiceDeclined}>Send Invoice</ModalHeader>

                    <ModalBody>
                        This should only be done once the draft invoice is finalized.  Are you sure?
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="primary"
                            disabled={isSaving}
                            onClick={onSendInvoiceConfirmed}
                        >
                            {isSaving ? 'Sending...' : 'Yes, Send It'}
                        </Button>
                        {' '}
                        <Button
                            color="secondary"
                            disabled={isSaving}
                            onClick={onSendInvoiceDeclined}
                        >
                            No, Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <ReceivePaymentModalDialog
                    isOpen={isReceivePaymentModalOpen}
                    onClose={onCloseReceivePaymentModal}
                />

                <Modal
                    backdrop="static"
                    id={`${bemBlockName}--view_payment_modal`}
                    isOpen={isViewPaymentModalOpen}
                    toggle={onCloseViewPaymentModal}
                >
                    <ModalHeader toggle={onCloseViewPaymentModal}>View Invoice Payment</ModalHeader>

                    <ModalBody>
                        Coming Coon...
                    </ModalBody>
                </Modal>
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(ViewInvoicePage);
