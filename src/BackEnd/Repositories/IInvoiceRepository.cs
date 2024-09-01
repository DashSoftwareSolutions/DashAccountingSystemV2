using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface IInvoiceRepository
    {
        Task<Invoice> GetByIdAsync(Guid invoiceId);

        Task<Invoice> GetByTenantIdAndInvoiceNumberAsync(Guid tenantId, uint invoiceNumber);

        Task<Invoice> GetDetailedByIdAsync(Guid invoiceId);

        Task<Invoice> GetDetailedByTenantIdAndInvoiceNumberAsync(Guid tenantId, uint invoiceNumber);

        Task<PagedResult<Invoice>> GetFilteredAsync(
            Guid tenantId,
            DateTime? dateRangeStart,
            DateTime? dateRangeEnd,
            IEnumerable<Guid>? includeCustomers,
            IEnumerable<Guid>? includeInvoices,
            Pagination pagination);

        Task<uint> GetNextInvoiceNumberAsync(Guid tenantId);

        Task<Invoice> CreateInvoiceAsync(Invoice invoice);

        Task<Invoice> UpdateCompleteInvoiceAsync(Invoice invoice, Guid contextUserId);

        Task<Invoice> UpdateInvoiceStatusAsync(
            Guid invoiceId,
            InvoiceStatus newStatus,
            Guid contextUserId);

        Task<Invoice> UpdateInvoiceStatusAsync(
            Guid tenantId,
            uint invoiceNumber,
            InvoiceStatus newStatus,
            Guid contextUserId);

        Task DeleteAsync(Guid invoiceId, Guid contextUserId);
    }
}
