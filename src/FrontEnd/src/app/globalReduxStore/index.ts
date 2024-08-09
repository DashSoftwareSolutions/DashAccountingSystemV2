import IAction from './action.interface';
import * as BalanceSheet from '../../features/accounting/balance-sheet/redux';
import * as ChartOfAccounts from '../../features/accounting/chart-of-accounts/redux';
import * as Ledger from '../../features/accounting/general-ledger/redux';
import * as Journal from '../../features/accounting/journal/redux';
import * as ProfitAndLoss from '../../features/accounting/profit-and-loss/redux';
import * as Invoice from '../../features/invoicing/invoices/redux';
import * as Customers from '../../features/sales/customers/redux';
import * as Products from '../../features/sales/products/redux';
import * as Employees from '../../features/time-tracking/employees/redux';
import * as Application from '../applicationRedux'
import * as Authentication from '../authentication/redux';
import * as ExportDownload from '../export';
import * as Lookups from '../lookupValues';
import * as SystemNotifications from '../notifications';

/**
 * Redux state tree for the entire application
 */
export interface RootState {
    application: Application.state;
    authentication: Authentication.state;
    balanceSheet: BalanceSheet.state;
    chartOfAccounts: ChartOfAccounts.state;
    customers: Customers.state;
    employees: Employees.state;
    exportDownload: ExportDownload.state;
    invoice: Invoice.state;
    journal: Journal.state;
    ledger: Ledger.state;
    lookups: Lookups.state;
    products: Products.state;
    profitAndLoss: ProfitAndLoss.state;
    systemNotifications: SystemNotifications.state;
}

/**
 * All Redux Reducers
 */
export const reducers = {
    application: Application.reducer,
    authentication: Authentication.reducer,
    balanceSheet: BalanceSheet.reducer,
    chartOfAccounts: ChartOfAccounts.reducer,
    customers: Customers.reducer,
    employees: Employees.reducer,
    exportDownload: ExportDownload.reducer,
    invoice: Invoice.reducer,
    journal: Journal.reducer,
    ledger: Ledger.reducer,
    lookups: Lookups.reducer,
    products: Products.reducer,
    profitAndLoss: ProfitAndLoss.reducer,
    systemNotifications: SystemNotifications.reducer,
};

/**
 * This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
 * correctly typed to match your store.
 */
export interface AppThunkAction<TAction extends IAction> {
    (dispatch: (action: TAction) => void, getState: () => RootState): void;
}
