import * as Accounts from './Accounts';
import * as BalanceSheet from './BalanceSheet';
import * as JournalEntry from './JournalEntry';
import * as Ledger from './Ledger';
import * as LookupValues from './LookupValues';
import * as SystemNotifications from './SystemNotifications';
import * as Tenants from './Tenants';
import * as WeatherForecasts from './WeatherForecasts';  // from scaffolded examples; TODO: remove

// The top-level state object
export interface ApplicationState {
    accounts: Accounts.AccountsState | undefined;
    balanceSheet: BalanceSheet.BalanceSheetState | undefined,
    journalEntry: JournalEntry.JournalEntryState | undefined;
    ledger: Ledger.LedgerState | undefined;
    lookups: LookupValues.LookupValuesState | undefined;
    systemNotifications: SystemNotifications.SystemNotificationsState | undefined;
    tenants: Tenants.TenantsState | undefined;
    weatherForecasts: WeatherForecasts.WeatherForecastsState | undefined; // from scaffolded examples; TODO: remove
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    accounts: Accounts.reducer,
    balanceSheet: BalanceSheet.reducer,
    journalEntry: JournalEntry.reducer,
    ledger: Ledger.reducer,
    lookups: LookupValues.reducer,
    tenants: Tenants.reducer,
    systemNotifications: SystemNotifications.reducer,
    weatherForecasts: WeatherForecasts.reducer, // from scaffolded examples; TODO: remove
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
