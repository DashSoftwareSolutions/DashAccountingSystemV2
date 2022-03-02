import AccountLite from './AccountLite';
import Amount from './Amount';
import CustomerLite from './Customer';
import InvoicePayment from './InvoicePayment';
import JournalEntryLite from './JournalEntryLite';
import PaymentMethod from './PaymentMethod';
import UserLite from './UserLite';

export default interface Payment {
    id?: string | null; // GUID (will be assigned by the system)
    tenantId: string | null; // GUID (required to create)
    customerId: string | null; // GUID (required to create)
    customer?: CustomerLite; // not required to create; part of response
    depositAccountId: string | null; // GUID (required to create)
    depositAccount?: AccountLite; // not required to create; part of response
    revenueAccountId: string | null; // GUID (required to create)
    revenueAccount?: AccountLite; // not required to create; part of response
    paymentMethodId: number | null; // integer ID; required to create
    paymentMethod?: PaymentMethod; // not required to create; part of response
    checkNumber: number | null; // optional unsigned integer
    paymentDate: string | null; // Date in YYYY-MM-DD format (required to create)
    amount: Amount | null; // required to create
    description: string | null; // required to create
    isPosted: boolean; // required to create but could be false
    journalEntryId?: string; // not required to create; part of response
    journalEntry?: JournalEntryLite; // not required to create; part of response
    invoices: InvoicePayment[]; // required to create
    created?: string; // timestamp in ISO 8601 format; not required to create; part of response
    createdBy?: UserLite; // not required to create; part of response
    updated?: string | null; // nullable timestamp in ISO 8601 format; not required to create; part of response
    updatedBy?: UserLite | null; // not required to create; part of response
}