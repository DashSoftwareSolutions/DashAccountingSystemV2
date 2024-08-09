import { Alert } from 'reactstrap';
import { TransactionStatus } from '../models';

function TransactionStatusLabel({
    status,
}: {
    status: TransactionStatus;
}) {
    let color: string;

    switch (status) {
        case TransactionStatus.Pending:
            color = 'warning';
            break;
        case TransactionStatus.Posted:
            color = 'success';
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
