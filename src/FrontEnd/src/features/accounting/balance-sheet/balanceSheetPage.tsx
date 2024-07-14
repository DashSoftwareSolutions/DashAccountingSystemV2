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
import { BalanceSheetReport } from './models';
import { actionCreators as balanceSheetActionCreators } from './redux';
import { actionCreators as exportActionCreators } from '../../../app/export';
import { RootState } from '../../../app/globalReduxStore';
import { actionCreators as notificationActionCreators } from '../../../app/notifications';
import AmountDisplay from '../../../common/components/amountDisplay';
import Loader from '../../../common/components/loader';
import MainPageContent from '../../../common/components/mainPageContent';
import ReportParametersAndControls from '../../../common/components/reportParametersAndControls';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import { DateRange } from '../../../common/models';
import useNamedState from '../../../common/utilities/useNamedState';
import usePrevious from '../../../common/utilities/usePrevious';

const logger: ILogger = new Logger('Balance Sheet Page');
const bemBlockName: string = 'balance_sheet_page';

const mapStateToProps = (state: RootState) => ({
    balanceSheet: state.balanceSheet?.reportData ?? null,
    dateRangeEnd: state?.balanceSheet?.dateRangeEnd,
    dateRangeStart: state?.balanceSheet?.dateRangeStart,
    excelDownloadError: state?.exportDownload?.error ?? null,
    excelDownloadInfo: state?.exportDownload?.downloadInfo ?? null,
    isDownloading: state?.exportDownload?.isFetching ?? false,
    isFetching: state.balanceSheet?.isFetching ?? false,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...balanceSheetActionCreators,
    reportDownloadError: exportActionCreators.reportError,
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type BalanceSheetPageReduxProps = ConnectedProps<typeof connector>;

type BalanceSheetPageProps = BalanceSheetPageReduxProps;

function BalanceSheetPage(props: BalanceSheetPageProps) {
    const {
        balanceSheet,
        dateRangeStart,
        dateRangeEnd,
        excelDownloadInfo,
        isDownloading,
        isFetching,
        reportDownloadError,
        requestBalanceSheetReportData,
        requestBalanceSheetReportExcelExport,
        reset,
        selectedTenant,
        updateDateRange,
    } = props;

    const [isDownloadInProgress, setIsDownloadInProgress] = useNamedState<boolean>('isDownloadInProgress', false);

    const navigate = useNavigate();
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

    // component did mount - fetch the data
    useEffect(() => {
        requestBalanceSheetReportData();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle download
    useEffect(() => {
        if (wasDownloading && !isDownloading) {
            if (!isNil(excelDownloadInfo)) {
                fetch(`/api/export-download?filename=${excelDownloadInfo.fileName}&format=${excelDownloadInfo.format}&token=${excelDownloadInfo.token}`)
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
                            a.download = excelDownloadInfo.fileName;
                            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again

                            // delay clearing `isDownloadInProgress` flag until save download window pops open
                            setTimeout(() => {
                                setIsDownloadInProgress(false);
                            }, 750);
                        }
                    })
                    .catch((error) => { //
                        logger.error('Error:', error);
                        setIsDownloadInProgress(false);
                    });
            } else {
                setIsDownloadInProgress(false);
            }
        }
    }, [
        excelDownloadInfo,
        isDownloading,
        reportDownloadError,
        setIsDownloadInProgress,
        wasDownloading,
    ]);

    const isDownloadingAuthoritative = isDownloading || isDownloadInProgress;

    const onRunReport = (newDateRange: DateRange) => {
        reset();
        updateDateRange(newDateRange);
        requestBalanceSheetReportData();
    };

    const onDownloadExcel = () => {
        requestBalanceSheetReportExcelExport();
        setIsDownloadInProgress(true);
    };

    return (
        <React.Fragment>
            <div className="page_header" id={`${bemBlockName}--header`}>
                <Row>
                    <Col>
                        <h1>Balance Sheet</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                <ReportParametersAndControls
                    bemBlockName={bemBlockName}
                    dateRangeEnd={dateRangeEnd ?? null}
                    dateRangeStart={dateRangeStart ?? null}
                    isRequestingExcelDownload={isDownloadingAuthoritative}
                    onDownloadExcel={onDownloadExcel}
                    onRunReport={onRunReport}
                    showDownloadExcelButton
                />

                {isFetching ? (
                    <Loader />
                ) : (
                    <p>TODO: Render the Balance Sheet</p>
                )}
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(BalanceSheetPage);
