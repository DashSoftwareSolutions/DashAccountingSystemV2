import * as React from 'react';
import { Alert } from 'reactstrap';
import InvoiceStatus from '../models/InvoiceStatus';

interface InvoiceStatusLabelProps {
    isPastDue: boolean;
    status: InvoiceStatus;
}

const InvoiceStatusLabel: React.FC<InvoiceStatusLabelProps> = ({ isPastDue, status }: InvoiceStatusLabelProps) => {
    let color: string;
    let statusText: string = status;

    switch (status) {
        case InvoiceStatus.Draft:
            color = 'secondary';
            break;

        case InvoiceStatus.Paid:
            color = 'success';
            break;

        case InvoiceStatus.Sent: {
            if (isPastDue) {
                color = 'warning';
                statusText = 'Past Due';
            } else {
                color = 'info';
            }
        }
    }

    return (
        <Alert
            color={color}
            style={{
                marginBottom: 0,
                marginLeft: -12,
                padding: '3px 11px',
            }}
        >
            {statusText}
        </Alert>
    );
}

export default InvoiceStatusLabel;

