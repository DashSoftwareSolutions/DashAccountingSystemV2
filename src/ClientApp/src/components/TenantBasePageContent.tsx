import * as React from 'react';

interface TenantBasePageContentProps {
    children?: JSX.Element | JSX.Element[];
    id: string;
}

const TenantBasePageContent: React.FC<TenantBasePageContentProps> = ({ children, id }: TenantBasePageContentProps) => ((
    <div id={id}>
        {children}
    </div>
));

export default TenantBasePageContent;