import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app.tsx';
import { store } from './app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename="/app">
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
);
