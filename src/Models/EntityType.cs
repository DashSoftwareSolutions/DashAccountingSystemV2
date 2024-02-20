namespace DashAccountingSystemV2.Models
{
    [Flags]
    public enum EntityType : ushort
    {
        Unknown = 0,

        // Basic Types
        Tenant = 1, // 2^0
        Person = 2, // 2^1
        ExternalOrganization = 4, // 2^2

        // Worker Types
        Employee = 8, // 2^3
        Contractor = 16, // 2^4
        // 2^5 ... 2^8 reserved for future use

        // Business Partner Types
        Customer = 512, // 2^9
        Vendor = 1024, // 2^10
        Supplier = 2048, // 2^11
        // 2^12 ... 2^15 reserved for future use
    }

    public static class EntityTypeExtensions
    {
        public static bool IsTenant(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.Tenant);
        }

        public static bool IsPerson(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.Person);
        }

        public static bool IsExternalOrganization(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.ExternalOrganization);
        }

        public static bool IsEmployee(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.Employee);
        }

        public static bool IsContractor(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.Contractor);
        }

        public static bool IsCustomer(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.Customer);
        }

        public static bool IsVendor(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.Vendor);
        }

        public static bool IsSupplier(this EntityType entityType)
        {
            return entityType.HasFlag(EntityType.Supplier);
        }
    }
}
