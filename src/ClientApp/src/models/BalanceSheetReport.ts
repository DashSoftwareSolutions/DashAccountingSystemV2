import Amount from './Amount';
import BalanceSheetReportAccount from './BalanceSheetReportAccount';

export default interface BalanceSheetReport {
    totalAssets: Amount;
    totalLiabilities: Amount;
    totalEquity: Amount;
    netIncome: Amount;
    totalLiabilitiesAndEquity: Amount;
    discrepancy?: Amount;
    assets: BalanceSheetReportAccount[];
    liabilities: BalanceSheetReportAccount[];
    equity: BalanceSheetReportAccount[];
}