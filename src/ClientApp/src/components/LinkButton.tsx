import * as React from 'react';
import { Button } from 'reactstrap';

interface LinkButtonProps {
    className?: string,
    onClick: React.MouseEventHandler<any>;
    children?: React.ReactNode;
    style?: object,
}

const LinkButton: React.FC<LinkButtonProps> = ({
    className,
    children,
    onClick,
    style,
}) => (
    <Button
        className={className}
        color="link"
        onClick={onClick}
        style={style}
    >
        {children}
    </Button>
);

export default LinkButton;