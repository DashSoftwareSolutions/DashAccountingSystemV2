export default interface InvoiceTerms {
    id: string | null; // GUID
    tenantId: string | null; // GUID
    isCustom: boolean;
    name: string | null;
    dueInDays: number | null;
    dueOnDayOfMonth: number | null;
    dueNextMonthThreshold: number | null;
}