using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class InvoiceBusinessLogic : IInvoiceBusinessLogic
    {
        private readonly IInvoiceRepository _invoiceRepository = null;
        private readonly ITenantRepository _tenantRepository = null;
        private readonly ILogger _logger = null;

        public InvoiceBusinessLogic(
            IInvoiceRepository invoiceRepository,
            ITenantRepository tenantRepository,
            ILogger<InvoiceBusinessLogic> logger)
        {
            _invoiceRepository = invoiceRepository;
            _tenantRepository = tenantRepository;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<Invoice>> CreateInvoice(Invoice invoice)
        {
            if (invoice == null)
                throw new ArgumentNullException(nameof(invoice));

            var tenant = await _tenantRepository.GetTenantAsync(invoice.TenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<Invoice>(ErrorType.RequestNotValid, "Tenant not found");
            }

            // TODO: Check that user has access to this tenant and permission to create the requested invoice

            try
            {
                var savedInvoice = await _invoiceRepository.CreateInvoiceAsync(invoice);
                return new BusinessLogicResponse<Invoice>(savedInvoice);
            }
            catch (Exception ex)
            {
                // TODO: More specific error handling -- distinguish between 400 Bad Request (409 Conflict if applicable) and true 500 Internal Server Error
                _logger.LogError(ex, "Error creating new Invoice");
                return new BusinessLogicResponse<Invoice>(ErrorType.RuntimeException, "Failed to create new Invoice");
            }
        }

        public async Task<BusinessLogicResponse> DeleteDraftInvoice(Guid tenantId, uint invoiceNumber, Guid contextUserId)
        {
            var invoiceToDelete = await _invoiceRepository.GetByTenantIdAndInvoiceNumberAsync(tenantId, invoiceNumber);

            if (invoiceToDelete == null)
                return new BusinessLogicResponse(ErrorType.RequestedEntityNotFound);

            if (invoiceToDelete.Status != InvoiceStatus.Draft)
                return new BusinessLogicResponse(
                    ErrorType.RequestNotValid,
                    $"Only Draft Invoices can be deleted.  Invoice {invoiceToDelete.InvoiceNumber} is currently in status '{invoiceToDelete.Status}'");

            await _invoiceRepository.DeleteAsync(invoiceToDelete.Id, contextUserId);

            return new BusinessLogicResponse();
        }

        public async Task<BusinessLogicResponse<Invoice>> GetInvoiceByTenantAndInvoiceNumber(Guid tenantId, uint invoiceNumber)
        {
            var invoice = await _invoiceRepository.GetDetailedByTenantIdAndInvoiceNumberAsync(tenantId, invoiceNumber);

            if (invoice == null)
                return new BusinessLogicResponse<Invoice>(ErrorType.RequestedEntityNotFound);

            // TODO: Check that user has access to this tenant and permission to view the requested invoice

            return new BusinessLogicResponse<Invoice>(invoice);
        }

        public async Task<BusinessLogicResponse<PagedResult<Invoice>>> GetPagedFilteredInvoices(Guid tenantId, DateTime? dateRangeStart, DateTime? dateRangeEnd, IEnumerable<Guid> includeCustomers, Pagination pagination)
        {
            // TODO: Check that user has access to this tenant and permission to view the requested invoices
            var results = await _invoiceRepository.GetFilteredAsync(
                tenantId,
                dateRangeStart,
                dateRangeEnd,
                includeCustomers,
                pagination);

            return new BusinessLogicResponse<PagedResult<Invoice>>(results);
        }

        public async Task<BusinessLogicResponse<Invoice>> UpdateInvoice(Invoice invoice, Guid contextUserId)
        {
            try
            {
                // TODO: Check that user has access to this tenant and permission to update the requested invoice
                var updatedInvoice = await _invoiceRepository.UpdateCompleteInvoiceAsync(invoice, contextUserId);

                if (updatedInvoice == null)
                    return new BusinessLogicResponse<Invoice>(ErrorType.RequestedEntityNotFound);

                return new BusinessLogicResponse<Invoice>(updatedInvoice);
            }
            catch (InvalidOperationException invOpEx)
            {
                _logger.LogError(invOpEx, "Failed to Update Invoice");
                return new BusinessLogicResponse<Invoice>(ErrorType.RequestNotValid, invOpEx);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to Update Invoice");
                return new BusinessLogicResponse<Invoice>(ErrorType.RuntimeException, "Failed to Update Invoice");
            }
        }

        public async Task<BusinessLogicResponse<Invoice>> UpdateInvoiceStatus(Guid tenantId, uint invoiceNumber, InvoiceStatus newStatus, Guid contextUserId)
        {
            // TODO: Check that user has access to this tenant and permission to update the requested invoice
            var updatedInvoice = await _invoiceRepository.UpdateInvoiceStatusAsync(tenantId, invoiceNumber, newStatus, contextUserId);

            if (updatedInvoice == null)
                return new BusinessLogicResponse<Invoice>(ErrorType.RequestedEntityNotFound);

            return new BusinessLogicResponse<Invoice>(updatedInvoice);
        }
    }
}
