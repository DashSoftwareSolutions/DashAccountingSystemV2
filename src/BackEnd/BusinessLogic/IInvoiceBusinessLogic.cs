using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface IInvoiceBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<Invoice>> CreateInvoice(Invoice invoice);

        Task<BusinessLogicResponse> DeleteDraftInvoice(Guid tenantId, uint invoiceNumber, Guid contextUserId);

        Task<BusinessLogicResponse<Invoice>> GetInvoiceByTenantAndInvoiceNumber(Guid tenantId, uint invoiceNumber);

        Task<BusinessLogicResponse<IEnumerable<InvoiceTerms>>> GetInvoiceTermsChoicesByTenant(Guid tenantId);

        Task<BusinessLogicResponse<PagedResult<Invoice>>> GetPagedFilteredInvoices(
            Guid tenantId,
            DateTime? dateRangeStart,
            DateTime? dateRangeEnd,
            IEnumerable<Guid>? includeCustomers,
            IEnumerable<Guid>? includeInvoices,
            Pagination pagination);

        Task<BusinessLogicResponse<Invoice>> UpdateInvoice(Invoice invoice, Guid contextUserId);

        Task<BusinessLogicResponse<Invoice>> UpdateInvoiceStatus(
            Guid invoiceId,
            InvoiceStatus newStatus,
            Guid contextUserId);

        Task<BusinessLogicResponse<Invoice>> UpdateInvoiceStatus(
            Guid tenantId,
            uint invoiceNumber,
            InvoiceStatus newStatus,
            Guid contextUserId);
    }
}
