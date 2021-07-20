import * as Accounts from './Accounts';
import * as BalanceSheet from './BalanceSheet';
import * as Customer from './Customer';
import * as Employee from './Employee';
import * as ExportDownload from './Export';
import * as JournalEntry from './JournalEntry';
import * as Ledger from './Ledger';
import * as LookupValues from './LookupValues';
import * as ProfitAndLoss from './ProfitAndLoss';
import * as SystemNotifications from './SystemNotifications';
import * as Tenants from './Tenants';
import * as TimeActivity from './TimeActivity';

// The top-level state object
export interface ApplicationState {
    accounts: Accounts.AccountsState | undefined;
    balanceSheet: BalanceSheet.BalanceSheetState | undefined,
    customers: Customer.CustomerStoreState | undefined;
    employees: Employee.EmployeeStoreState | undefined;
    exportDownload: ExportDownload.ExportState | undefined,
    journalEntry: JournalEntry.JournalEntryState | undefined;
    ledger: Ledger.LedgerState | undefined;
    lookups: LookupValues.LookupValuesState | undefined;
    profitAndLoss: ProfitAndLoss.ProfitAndLossState | undefined;
    systemNotifications: SystemNotifications.SystemNotificationsState | undefined;
    tenants: Tenants.TenantsState | undefined;
    timeActivity: TimeActivity.TimeActivityStoreState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    accounts: Accounts.reducer,
    balanceSheet: BalanceSheet.reducer,
    customers: Customer.reducer,
    employees: Employee.reducer,
    exportDownload: ExportDownload.reducer,
    journalEntry: JournalEntry.reducer,
    ledger: Ledger.reducer,
    lookups: LookupValues.reducer,
    profitAndLoss: ProfitAndLoss.reducer,
    systemNotifications: SystemNotifications.reducer,
    tenants: Tenants.reducer,
    timeActivity: TimeActivity.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
