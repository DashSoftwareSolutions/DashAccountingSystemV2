import Amount from './Amount';

export default interface InvoiceLineItem {
    id: string | null; // GUID (not required to create)
    orderNumber: number; // uint (required to create)
    date: string | null; // Date as YYYY-MM-DD (required to create)
    productId: string | null; // GUID (required to create)
    productOrService?: string | null;
    productCategory?: string | null;
    description: string | null; // required to create
    quantity: number | null; // required to create
    unitPrice: Amount | null; // required to create
    total?: Amount | null;
    timeActivityId: string | null; // nullable GUID - ID of linked Time Activity
}