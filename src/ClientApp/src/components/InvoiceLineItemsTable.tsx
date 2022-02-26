import * as React from 'react';
import { map } from 'lodash';
import moment from 'moment-timezone';
import { DEFAULT_AMOUNT } from '../common/Constants';
import AmountDisplay from './AmountDisplay';
import InvoiceLineItem from '../models/InvoiceLineItem';

interface InvoiceLineItemsTableProps {
    lineItems: InvoiceLineItem[];
}

const InvoiceLineItemsTable: React.FC<InvoiceLineItemsTableProps> = ({ lineItems }: InvoiceLineItemsTableProps) => {
    return (
        <table className="table table-hover table-sm report-table">
            <thead>
                <tr>
                    <th className="col-md-1 bg-white sticky-top sticky-border">#</th>
                    <th className="col-md-1 bg-white sticky-top sticky-border">{'Service\u00A0Date'}</th>
                    <th className="col-md-2 bg-white sticky-top sticky-border">Product/Service</th>
                    <th className="col-md-5 bg-white sticky-top sticky-border">Description</th>
                    <th className="col-md-1 bg-white sticky-top sticky-border text-right">Qty</th>
                    <th className="col-md-1 bg-white sticky-top sticky-border text-right">Rate</th>
                    <th className="col-md-1 bg-white sticky-top sticky-border text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                {map(lineItems, (li) => ((
                    <tr key={`line-item-${li.id ?? li.orderNumber.toString()}`}>
                        <td>{li.orderNumber}</td>
                        <td>
                            {moment(li.date).format('L')}
                        </td>
                        <td>{li.productOrService}</td>
                        <td>
                            <span
                                dangerouslySetInnerHTML={{ __html: li.description?.replace(/\r?\n/g, '<br />') ?? '' }}
                                style={{ wordWrap: 'break-word' }}
                            />
                        </td>
                        <td className="text-right">{li.quantity}</td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={li.unitPrice ?? DEFAULT_AMOUNT}
                                showCurrency
                            />
                        </td>
                        <td className="text-right">
                            <AmountDisplay
                                amount={li.total ?? DEFAULT_AMOUNT}
                                showCurrency
                            />
                        </td>
                    </tr>
                )))}
            </tbody>
        </table>
    );
};

export default InvoiceLineItemsTable;