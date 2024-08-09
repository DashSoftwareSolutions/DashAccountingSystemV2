import { Amount } from '../../../../common/models';
import { ReportAccount } from '../../chart-of-accounts/models';

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
