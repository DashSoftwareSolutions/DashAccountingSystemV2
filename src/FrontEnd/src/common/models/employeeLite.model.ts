export default interface EmployeeLite {
    id: string; // GUID
    employeeNumber: number; // uint
    displayName: string;
    isBillableByDefault: boolean;
    hourlyBillableRate: number | null;
    isUser: boolean;
    userId: string | null; // GUID
}