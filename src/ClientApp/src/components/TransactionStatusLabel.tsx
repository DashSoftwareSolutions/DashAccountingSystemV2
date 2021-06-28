import * as React from 'react';
import { Alert } from 'reactstrap';
import TransactionStatus from '../models/TransactionStatus';

interface TransactionStatusLabelProps {
    status: TransactionStatus;
}

const TransactionStatusLabel: React.FC<TransactionStatusLabelProps> = ({ status }: TransactionStatusLabelProps) => {
    let color: string;

    switch (status) {
        case TransactionStatus.Pending:
            color = 'warning';
            break;
        case TransactionStatus.Posted:
            color = 'success';
            break;
        case TransactionStatus.Canceled:
            color = 'danger';
            break;
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
            {status}
        </Alert>
    );
}

export default TransactionStatusLabel;
