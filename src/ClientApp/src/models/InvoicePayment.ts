import Amount from './Amount';
import InvoiceLite from './InvoiceLite';

export default interface InvoicePayment {
    invoiceId: string; // GUID (required to create)
    invoice?: InvoiceLite; // not required to create; part of response
    isSelected?: boolean; // Not part of API request or response at all; used for UI state management
    amount: Amount; // required to create
}