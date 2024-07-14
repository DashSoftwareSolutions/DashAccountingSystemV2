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
import {
    AmountType,
    DateRange,
} from '../../../common/models';
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

    const hasBalanceSheetData = !isNil(balanceSheet);

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
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

                {isFetching && (
                    <Loader />
                )}

                {!isFetching && !hasBalanceSheetData && (
                    <p>No data</p>
                )}

                {!isFetching && hasBalanceSheetData && (
                    <table className="table table-hover table-sm report-table">
                        <thead>
                            <tr>
                                <th className="col-md-10 bg-white sticky-top sticky-border" />
                                <th className="col-md-2 bg-white sticky-top sticky-border text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="report-section-header">
                                <td colSpan={2}>ASSETS</td>
                            </tr>
                            {balanceSheet.assets.map((assetAccount) => ((
                                <tr key={assetAccount.id}>
                                    <td className="account-name">
                                        {`${assetAccount.accountNumber} - ${assetAccount.name}`}
                                    </td>
                                    <td className="text-right">
                                        <AmountDisplay
                                            amount={assetAccount.balance}
                                            normalBalanceType={AmountType.Debit}
                                        />
                                    </td>
                                </tr>
                            )))}
                            <tr className="report-total-row">
                                <td>TOTAL ASSETS</td>
                                <td className="text-right">
                                    <AmountDisplay
                                        amount={balanceSheet.totalAssets}
                                        normalBalanceType={AmountType.Debit}
                                        showCurrency
                                    />
                                </td>
                            </tr>
                            <tr className="report-section-header">
                                <td colSpan={2}>LIABILITIES</td>
                            </tr>
                            {balanceSheet.liabilities.map((liabilityAccount) => ((
                                <tr key={liabilityAccount.id}>
                                    <td className="account-name">
                                        {`${liabilityAccount.accountNumber} - ${liabilityAccount.name}`}
                                    </td>
                                    <td className="text-right">
                                        <AmountDisplay
                                            amount={liabilityAccount.balance}
                                            normalBalanceType={AmountType.Credit}
                                        />
                                    </td>
                                </tr>
                            )))}
                            <tr className="report-total-row">
                                <td>TOTAL LIABILITIES</td>
                                <td className="text-right">
                                    <AmountDisplay
                                        amount={balanceSheet.totalLiabilities}
                                        normalBalanceType={AmountType.Credit}
                                        showCurrency
                                    />
                                </td>
                            </tr>
                            <tr className="report-section-header">
                                <td colSpan={2}>EQUITY</td>
                            </tr>
                            {balanceSheet.equity.map((equityAccount) => ((
                                <tr key={equityAccount.id}>
                                    <td className="account-name">
                                        {`${equityAccount.accountNumber} - ${equityAccount.name}`}
                                    </td>
                                    <td className="text-right">
                                        <AmountDisplay
                                            amount={equityAccount.balance}
                                            normalBalanceType={AmountType.Credit}
                                        />
                                    </td>
                                </tr>
                            )))}
                            <tr>
                                <td className="account-name">Net Income</td>
                                <td className="text-right">
                                    <AmountDisplay
                                        amount={balanceSheet.netIncome}
                                        normalBalanceType={AmountType.Credit}
                                    />
                                </td>
                            </tr>
                            <tr className="report-total-row">
                                <td>TOTAL EQUITY</td>
                                <td className="text-right">
                                    <AmountDisplay
                                        amount={balanceSheet.totalEquity}
                                        normalBalanceType={AmountType.Credit}
                                        showCurrency
                                    />
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="report-grand-total-row">
                                <td>TOTAL LIABILITIES &amp; EQUITY</td>
                                <td className="text-right">
                                    <AmountDisplay
                                        amount={balanceSheet.totalLiabilitiesAndEquity}
                                        normalBalanceType={AmountType.Credit}
                                        showCurrency
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(BalanceSheetPage);
