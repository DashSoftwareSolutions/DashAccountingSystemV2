import Amount from './Amount';
import InvoiceLite from './InvoiceLite';

export default interface InvoicePayment {
    invoiceId: string; // GUID (required to create)
    invoice?: InvoiceLite; // not required to create; part of response
    amount: Amount; // required to create
}