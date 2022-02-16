using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
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
            IEnumerable<Guid> includeCustomers,
            Pagination pagination);

        Task<uint> GetNextInvoiceNumberAsync(Guid tenantId);

        Task<Invoice> InsertAsync(Invoice invoice);

        Task<Invoice> UpdateAsync(Invoice invoice, Guid contextUserId);

        Task DeleteAsync(Guid invoiceId, Guid contextUserId);
    }
}
