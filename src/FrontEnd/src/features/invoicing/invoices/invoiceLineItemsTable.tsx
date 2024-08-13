import React from 'react';
import { DateTime } from 'luxon';
import { InvoiceLineItem } from './models';
import AmountDisplay from '../../../common/components/amountDisplay';
import { DEFAULT_AMOUNT } from '../../../common/constants';

type PropTypes = {
    lineItems: InvoiceLineItem[];
};

function InvoiceLineItemsTable({ lineItems }: PropTypes) {
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
                {lineItems.map((li) => ((
                    <tr key={`line-item-${li.id ?? li.orderNumber.toString()}`}>
                        <td>{li.orderNumber}</td>
                        <td>
                            {/* TODO/FIXME: Would like localization support but want months and days to have two digits always (w/ leading zeros if necessary) in en-US locale */}
                            {/*DateTime.fromISO(invoice.issueDate).toLocaleString(DateTime.DATE_SHORT)*/}
                            {DateTime.fromISO(li.date ?? '').toFormat('MM/dd/yyyy')}
                        </td>
                        <td>{li.productOrService}</td>
                        <td>
                            <span
                                dangerouslySetInnerHTML={{ __html: li.description?.replace(/\r?\n/g, '<br />') ?? '' }}
                                style={{ wordWrap: 'break-word' }}
                            />
                        </td>
                        <td className="text-end">{li.quantity}</td>
                        <td className="text-end">
                            <AmountDisplay
                                amount={li.unitPrice ?? DEFAULT_AMOUNT}
                                showCurrency
                            />
                        </td>
                        <td className="text-end">
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
}

export default InvoiceLineItemsTable;
