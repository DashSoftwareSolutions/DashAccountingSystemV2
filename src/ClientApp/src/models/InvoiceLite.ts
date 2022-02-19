import Amount from './Amount';
import InvoiceStatus from './InvoiceStatus';

export default interface InvoiceLite {
    id: string; // GUID
    invoiceNumber: number; // uint
    customerName: string;
    amount: Amount;
    issueDate: string; // Date as YYYY-MM-DD
    dueDate: string; // Date as YYYY-MM-DD
    terms: string;
    status: InvoiceStatus;
}
