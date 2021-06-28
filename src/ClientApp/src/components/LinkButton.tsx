import * as React from 'react';
import { Button } from 'reactstrap';

interface LinkButtonProps {
    onClick: React.MouseEventHandler<any>;
    children?: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({ children, onClick }) => (
    <Button color="link" onClick={onClick}>
        {children}
    </Button>
);

export default LinkButton;