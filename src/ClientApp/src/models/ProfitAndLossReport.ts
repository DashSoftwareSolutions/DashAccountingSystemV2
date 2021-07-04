import Amount from './Amount';
import ReportAccount from './ReportAccount';

export default interface ProfitAndLossReport {
    grossProfit: Amount;
    totalOperatingExpenses: Amount;
    netOperatingIncome: Amount;
    totalOtherIncome: Amount;
    totalOtherExpenses: Amount;
    netOtherIncome: Amount;
    netIncome: Amount;
    operatingIncome: ReportAccount[];
    operatingExpenses: ReportAccount[];
    otherIncome: ReportAccount[];
    otherExpenses: ReportAccount[];
}