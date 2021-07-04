﻿import Amount from './Amount';
import ReportAccount from './ReportAccount';

export default interface BalanceSheetReport {
    totalAssets: Amount;
    totalLiabilities: Amount;
    totalEquity: Amount;
    netIncome: Amount;
    totalLiabilitiesAndEquity: Amount;
    discrepancy?: Amount;
    assets: ReportAccount[];
    liabilities: ReportAccount[];
    equity: ReportAccount[];
}