import React from 'react';
import { Alert } from 'reactstrap';
import { InvoiceStatus } from './models';

type PropTypes = {
    isPastDue: boolean;
    status: InvoiceStatus;
}

function InvoiceStatusLabel({
    isPastDue,
    status,
}: PropTypes) {
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
