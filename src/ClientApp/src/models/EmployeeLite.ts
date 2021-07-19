export default interface EmployeeLite {
    id: string; // GUID
    employeeNumber: number; // uint
    displayName: string;
    isBillableByDefault: boolean;
    hourlyBillableRate: number;
    isUser: boolean;
    userId: string | null; // GUID
}