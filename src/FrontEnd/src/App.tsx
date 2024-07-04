import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

    useEffect(() => {
        async function fetchBootstrap() {
            try {
                const response = await fetch('/api/bootstrap');

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                console.log('Boostrap Response:', json);
            } catch (error: any) {
                console.error(error?.message ?? 'Error calling API');
            }
        }

        fetchBootstrap();
    });

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
