import * as Accounts from './Accounts';
import * as Counter from './Counter';
import * as Tenants from './Tenants';
import * as WeatherForecasts from './WeatherForecasts';

// The top-level state object
export interface ApplicationState {
    accounts: Accounts.AccountsState | undefined;
    counter: Counter.CounterState | undefined;
    tenants: Tenants.TenantsState | undefined;
    weatherForecasts: WeatherForecasts.WeatherForecastsState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    accounts: Accounts.reducer,
    counter: Counter.reducer,
    tenants: Tenants.reducer,
    weatherForecasts: WeatherForecasts.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
