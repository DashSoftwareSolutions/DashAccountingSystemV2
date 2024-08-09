using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface IInvoiceTermsRepository
    {
        Task<InvoiceTerms> GetByIdAsync(Guid invoiceTermsId);

        Task<IEnumerable<InvoiceTerms>> GetInvoiceTermsChoicesAsync(Guid tenantId);

        Task<InvoiceTerms> InsertAsync(InvoiceTerms invoiceTerms);

        Task<InvoiceTerms> UpdateAsync(InvoiceTerms invoiceTerms, Guid contextUserId);

        Task DeleteAsync(Guid invoiceTermsId, Guid contextUserId);
    }
}
