import React from 'react';
import { Button } from 'reactstrap';

type PropTypes = {
    className?: string;
    onClick: React.MouseEventHandler<any>;
    children?: React.ReactNode;
    style?: object;
};

function LinkButton({
    className,
    children,
    onClick,
    style,
}: PropTypes) {
    return (
        <Button
            className={className}
            color="link"
            onClick={onClick}
            style={style}
        >
            {children}
        </Button>
    );
}

export default LinkButton;
