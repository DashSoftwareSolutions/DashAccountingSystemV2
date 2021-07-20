import CustomerLite from './CustomerLite';
import EmployeeLite from './EmployeeLite';
import ProductLite from './ProductLite';

export default interface TimeActivity {
    id?: string | null; // GUID
    tenantId: string | null // GUID (required to create)
    customerId: string | null; // GUID (required to create)
    customer?: CustomerLite | null;
    employeeId: string | null; // GUID (required to create)
    employee?: EmployeeLite | null;
    productId: string | null; // GUID (required to create)
    product?: ProductLite | null;
    isBillable: boolean;
    hourlyBillingRate: number | null;
    hourlyBillingRateAsString?: string | null; // keep the rate as a raw string as well as a parsed float; helps with XXX.0X issue
    date: string | null; // Date in YYYY-MM-DD format (required to create)
    timeZone: string | null;
    startTime: string | null; // Time of day string in hh:mm:ss format (required to create)
    endTime: string | null; // Time of day string in hh:mm:ss format (required to create)
    break: string | null; // Duration in hh:mm:ss format (optional)
    description: string | null; // required to create
    totalTime?: string | null; // Duration in hh:mm:ss format (not required to create; part of response)
    totalBillableAmount?: number | null; // not required to create; part of response
}