import InvoiceStatus from './invoiceStatus.model';
import {
    Amount,
    DateTimeString,
} from '../../../../common/models';

export default interface InvoiceLite {
    id: string; // GUID
    invoiceNumber: number; // uint
    customerName: string;
    amount: Amount;
    issueDate: DateTimeString; // Date as YYYY-MM-DD
    dueDate: DateTimeString; // Date as YYYY-MM-DD
    terms: string;
    status: InvoiceStatus;
}
