import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

function ScrollableContent({
    autoHide = true,
    children,
    height = 630,
}: {
    autoHide?: boolean;
    children: React.ReactNode;
    height?: number;
}) {
    return (
        <Scrollbars
            autoHide={autoHide}
            style={{ height }}
        >
            <div className="scrollable-content-container">
                {children}
            </div>
        </Scrollbars>
    );
}

export default ScrollableContent;
