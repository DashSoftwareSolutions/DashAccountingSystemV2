import * as React from 'react';
import { Jumbotron } from 'reactstrap';

interface TenantBasePageHeaderProps {
    children?: JSX.Element | JSX.Element[];
    id: string;
}

const TenantBasePageHeader: React.FC<TenantBasePageHeaderProps> = ({ children, id }: TenantBasePageHeaderProps) => ((
    <Jumbotron
        id={id}
        style={{
            marginTop: 11,
            paddingTop: 22,
            paddingBottom: 22,
        }}
    >
        {children}
    </Jumbotron>
));

export default TenantBasePageHeader;