import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from './app/store/configureStore';
import App from './app';
import reportWebVitals from './reportWebVitals';

// Create browser history to use in the Redux store
const baseUrl: string = '/app'; // When the front-end application is served along with the back-end, the front-end is served under /app.  TODO: See if we can avoid hard-coding this.
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, pre-populating with state from the server where available.
const store = configureStore(history);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
