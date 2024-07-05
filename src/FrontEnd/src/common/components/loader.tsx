import React from 'react';

function Loader() {
    return (
        <div id="app_loading_spinner" className="align-items-center justify-content-center" style={{ display: 'flex', height: 'calc(100vh - 250px)' }} >
            <div className="spinner-border" role="status" style={{ width: '5rem', height: '5rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Loader;
