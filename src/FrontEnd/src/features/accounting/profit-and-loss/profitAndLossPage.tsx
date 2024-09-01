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
import { actionCreators as profitAndLossActionCreators } from './redux';
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
    DateRangeMacroType,
} from '../../../common/models';
import useNamedState from '../../../common/utilities/useNamedState';
import usePrevious from '../../../common/utilities/usePrevious';

const logger: ILogger = new Logger('Profit & Loss Page');
const bemBlockName: string = 'profit_and_loss_page';

const mapStateToProps = (state: RootState) => ({
    profitAndLossReport: state.profitAndLoss?.reportData ?? null,
    dateRangeEnd: state?.profitAndLoss?.dateRangeEnd,
    dateRangeStart: state?.profitAndLoss?.dateRangeStart,
    excelDownloadError: state?.exportDownload?.error ?? null,
    excelDownloadInfo: state?.exportDownload?.downloadInfo ?? null,
    isDownloading: state?.exportDownload?.isFetching ?? false,
    isFetching: state.profitAndLoss?.isFetching ?? false,
    selectedTenant: state.application.selectedTenant,
});

const mapDispatchToProps = {
    ...profitAndLossActionCreators,
    reportDownloadError: exportActionCreators.reportError,
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ProfitAndLossPageReduxProps = ConnectedProps<typeof connector>;

type ProfitAndLossPageProps = ProfitAndLossPageReduxProps;

function ProfitAndLossPage(props: ProfitAndLossPageProps) {
    const {
        profitAndLossReport,
        dateRangeStart,
        dateRangeEnd,
        excelDownloadInfo,
        isDownloading,
        isFetching,
        reportDownloadError,
        requestProfitAndLossReportData,
        requestProfitAndLossReportExcelExport,
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
        requestProfitAndLossReportData();
        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle download
    // TODO: Can it be extracted into a custom hook for reuse?
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
                    .catch((error) => {
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
        requestProfitAndLossReportData();
    };

    const onDownloadExcel = () => {
        requestProfitAndLossReportExcelExport();
        setIsDownloadInProgress(true);
    };

    const hasProfitAndLossData = !isNil(profitAndLossReport);

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col>
                        <h1>Profit &amp; Loss</h1>
                        <p className="page_header--subtitle">{selectedTenant?.name}</p>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                <ReportParametersAndControls
                    bemBlockName={bemBlockName}
                    dateRangeEnd={dateRangeEnd ?? null}
                    dateRangeStart={dateRangeStart ?? null}
                    defaultDateRangeMacro={DateRangeMacroType.ThisYearToDate}
                    isRequestingExcelDownload={isDownloadingAuthoritative}
                    onDownloadExcel={onDownloadExcel}
                    onRunReport={onRunReport}
                    showDownloadExcelButton
                />

                {isFetching && (
                    <Loader />
                )}

                {!isFetching && !hasProfitAndLossData && (
                    <p>No data</p>
                )}

                {!isFetching && hasProfitAndLossData && (
                    <table className="table table-hover table-sm report-table">
                        <thead>
                            <tr>
                                <th className="col-md-10 bg-white sticky-top sticky-border" />
                                <th className="col-md-2 bg-white sticky-top sticky-border text-end">TOTAL</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="report-section-header">
                                <td colSpan={2}>
                                    OPERATING INCOME
                                </td>
                            </tr>

                            {profitAndLossReport.operatingIncome.map((opIncomeAccount) => ((
                                <tr key={opIncomeAccount.id}>
                                    <td className="account-name">
                                        {`${opIncomeAccount.accountNumber} - ${opIncomeAccount.name}`}
                                    </td>
                                    <td className="text-end">
                                        <AmountDisplay
                                            amount={opIncomeAccount.balance}
                                            normalBalanceType={AmountType.Credit}
                                        />
                                    </td>
                                </tr>
                            )))}

                            <tr className="report-total-row">
                                <td>GROSS PROFIT</td>
                                <td className="text-end">
                                    <AmountDisplay
                                        amount={profitAndLossReport.grossProfit}
                                        normalBalanceType={AmountType.Credit}
                                        showCurrency
                                    />
                                </td>
                            </tr>

                            <tr className="report-section-header">
                                <td>OPERATING EXPENSES</td>
                            </tr>

                            {profitAndLossReport.operatingExpenses.map((opExpenseAccount) => ((
                                <tr key={opExpenseAccount.id}>
                                    <td className="account-name">
                                        {`${opExpenseAccount.accountNumber} - ${opExpenseAccount.name}`}
                                    </td>
                                    <td className="text-end">
                                        <AmountDisplay
                                            amount={opExpenseAccount.balance}
                                            normalBalanceType={AmountType.Debit}
                                        />
                                    </td>
                                </tr>
                            )))}

                            <tr className="report-total-row">
                                <td>TOTAL OPERATING EXPENSES</td>
                                <td className="text-end">
                                    <AmountDisplay
                                        amount={profitAndLossReport.totalOperatingExpenses}
                                        normalBalanceType={AmountType.Debit}
                                        showCurrency
                                    />
                                </td>
                            </tr>

                            <tr className="report-grand-total-row">
                                <td>NET OPERATING INCOME</td>
                                <td className="text-end">
                                    <AmountDisplay
                                        amount={profitAndLossReport.netOperatingIncome}
                                        normalBalanceType={AmountType.Credit}
                                        showCurrency
                                    />
                                </td>
                            </tr>

                            <tr className="report-section-header">
                                <td colSpan={2}>
                                    OTHER INCOME
                                </td>
                            </tr>

                            {profitAndLossReport.otherIncome.map((otherIncomeAccount) => ((
                                <tr key={otherIncomeAccount.id}>
                                    <td className="account-name">
                                        {`${otherIncomeAccount.accountNumber} - ${otherIncomeAccount.name}`}
                                    </td>
                                    <td className="text-end">
                                        <AmountDisplay
                                            amount={otherIncomeAccount.balance}
                                            normalBalanceType={AmountType.Credit}
                                        />
                                    </td>
                                </tr>
                            )))}

                            <tr className="report-total-row">
                                <td>TOTAL OTHER INCOME</td>
                                <td className="text-end">
                                    <AmountDisplay
                                        amount={profitAndLossReport.totalOtherIncome}
                                        normalBalanceType={AmountType.Credit}
                                        showCurrency
                                    />
                                </td>
                            </tr>

                            <tr className="report-section-header">
                                <td>OTHER EXPENSES</td>
                            </tr>

                            {profitAndLossReport.otherExpenses.map((otherExpenseAccount) => ((
                                <tr key={otherExpenseAccount.id}>
                                    <td className="account-name">
                                        {`${otherExpenseAccount.accountNumber} - ${otherExpenseAccount.name}`}
                                    </td>
                                    <td className="text-end">
                                        <AmountDisplay
                                            amount={otherExpenseAccount.balance}
                                            normalBalanceType={AmountType.Debit}
                                        />
                                    </td>
                                </tr>
                            )))}

                            <tr className="report-total-row">
                                <td>TOTAL OTHER EXPENSES</td>
                                <td className="text-end">
                                    <AmountDisplay
                                        amount={profitAndLossReport.totalOtherExpenses}
                                        normalBalanceType={AmountType.Debit}
                                        showCurrency
                                    />
                                </td>
                            </tr>

                            <tr className="report-grand-total-row">
                                <td>NET OTHER INCOME</td>
                                <td className="text-end">
                                    <AmountDisplay
                                        amount={profitAndLossReport.netOtherIncome}
                                        normalBalanceType={AmountType.Credit}
                                        showCurrency
                                    />
                                </td>
                            </tr>
                        </tbody>

                        <tfoot>
                            <tr className="report-grand-total-row">
                                <td>NET INCOME</td>
                                <td className="text-end">
                                    <AmountDisplay
                                        amount={profitAndLossReport.netIncome}
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

export default connector(ProfitAndLossPage);
