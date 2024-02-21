import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app.tsx';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename="/app">
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
