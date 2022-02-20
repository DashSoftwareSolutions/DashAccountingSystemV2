import Amount from './Amount';
import CustomerLite from './CustomerLite';
import InvoiceLineItem from './InvoiceLineItem';
import InvoiceStatus from './InvoiceStatus';
import InvoiceTerms from './InvoiceTerms';

export default interface Invoice {
    id?: string; // GUID (not required to create; required to update)
    tenantId: string; // GUID (required to create)
    invoiceNumber?: number; // uint (not required to create; required to update)
    status: InvoiceStatus; // required to create
    customerId: string | null; // GUID (required to create)
    customer?: CustomerLite; // not required to create; part of response
    customerAddress: string | null;
    customerEmail: string | null;
    invoiceTermsId: string | null; // GUID (required to create)
    invoiceTerms?: InvoiceTerms; // not required to create; part of response
    issueDate: string | null; // Date in YYYY-MM-DD format; required to create
    dueDate: string | null; // Date in YYYY-MM-DD format; required to create
    amount?: Amount; // not required to create; part of response
    message: string | null;
    lineItems: InvoiceLineItem[];
}
