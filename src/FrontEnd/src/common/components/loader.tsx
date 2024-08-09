import React from 'react';

type PropTypes = {
    id?: string;
    topOffset?: number;
}

function Loader({
    id = 'app_loading_spinner',
    topOffset = 0,
}: PropTypes) {
    return (
        <div
            className="align-items-center justify-content-center"
            id={id}
            style={{
                display: 'flex',
                height: `calc(100vh - ${topOffset}px)`,
            }}
        >
            <div
                className="spinner-border"
                role="status"
                style={{
                    width: '5rem',
                    height: '5rem',
                }}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Loader;
