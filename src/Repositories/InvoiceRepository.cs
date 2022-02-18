using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Npgsql;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ApplicationDbContext _db = null;

        public InvoiceRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<Invoice> CreateInvoiceAsync(Invoice invoice)
        {
            if (invoice == null)
                throw new ArgumentNullException(nameof(invoice), "Invoice cannot be null");

            using (var transaction = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    var tenant = await _db.Tenant.FirstOrDefaultAsync(t => t.Id == invoice.TenantId);

                    if (tenant == null)
                        throw new ArgumentException(
                            $"Journal Entry specifies a non-existent Tenant (ID {invoice.TenantId}).",
                            nameof(invoice));

                    if (invoice.InvoiceNumber == 0)
                    {
                        invoice.InvoiceNumber = await GetNextInvoiceNumberAsync(invoice.TenantId);
                    }

                    await _db.Invoice.AddAsync(invoice);
                    await _db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return await GetDetailedByIdAsync(invoice.Id);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }
        public async Task DeleteAsync(Guid invoiceId, Guid contextUserId)
        {
            // TODO: For now, this is a _HARD_ delete.  Perhaps in the future we can consider soft-deletion if it makes sense (e.g. "Oops; I deleted it by accident!  Undo that please!")
            var invoiceToDelete = await GetByIdAsync(invoiceId);

            if (invoiceToDelete == null)
                return;

            if (invoiceToDelete.Status != InvoiceStatus.Draft)
                return;

            _db.Invoice.Remove(invoiceToDelete);
            await _db.SaveChangesAsync();
        }

        public async Task<Invoice> GetByIdAsync(Guid invoiceId)
        {
            return await _db
                .Invoice
                .Where(inv => inv.Id == invoiceId)
                .Include(je => je.Tenant)
                .SingleOrDefaultAsync();
        }

        public async Task<Invoice> GetByTenantIdAndInvoiceNumberAsync(Guid tenantId, uint invoiceNumber)
        {
            return await _db
                .Invoice
                .Where(inv =>
                    inv.TenantId == tenantId &&
                    inv.InvoiceNumber == invoiceNumber)
                .Include(je => je.Tenant)
                .SingleOrDefaultAsync();
        }

        public async Task<Invoice> GetDetailedByIdAsync(Guid invoiceId)
        {
            return await _db
                .Invoice
                .Where(inv => inv.Id == invoiceId)
                .Include(inv => inv.Tenant)
                .Include(inv => inv.Tenant.DefaultAssetType)
                .Include(inv => inv.Customer)
                .Include(inv => inv.InvoiceTerms)
                .Include(inv => inv.CreatedBy)
                .Include(inv => inv.UpdatedBy)
                .Include(inv => inv.LineItems)
                    .ThenInclude(invLineItem => invLineItem.ProductOrService)
                .Include(inv => inv.LineItems)
                    .ThenInclude(invLineItem => invLineItem.ProductOrService.Category)
                .Include(inv => inv.LineItems)
                    .ThenInclude(invLineItem => invLineItem.AssetType)
                .SingleOrDefaultAsync();
        }

        public async Task<Invoice> GetDetailedByTenantIdAndInvoiceNumberAsync(Guid tenantId, uint invoiceNumber)
        {
            return await _db
                .Invoice
                .Where(inv =>
                    inv.TenantId == tenantId &&
                    inv.InvoiceNumber == invoiceNumber)
                .Include(inv => inv.Tenant)
                .Include(inv => inv.Tenant.DefaultAssetType)
                .Include(inv => inv.Customer)
                .Include(inv => inv.InvoiceTerms)
                .Include(inv => inv.CreatedBy)
                .Include(inv => inv.UpdatedBy)
                .Include(inv => inv.LineItems)
                    .ThenInclude(invLineItem => invLineItem.ProductOrService)
                .Include(inv => inv.LineItems)
                    .ThenInclude(invLineItem => invLineItem.ProductOrService.Category)
                .Include(inv => inv.LineItems)
                    .ThenInclude(invLineItem => invLineItem.AssetType)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedResult<Invoice>> GetFilteredAsync(
            Guid tenantId,
            DateTime? dateRangeStart,
            DateTime? dateRangeEnd,
            IEnumerable<Guid> includeCustomers,
            Pagination pagination)
        {
            // TODO: Implement support for other sorting options (per specification in the pagination parameters) if needed/wanted
            const string resultsSelectSql = @"
  SELECT inv.""Id"" AS invoice_id
        ,inv.*
        ,SUM(COALESCE(inv_line_item.""Total"", 0)) AS total 
        ,it.""Id"" AS invoice_terms_id
        ,it.*
        ,c.""EntityId"" AS customer_id
        ,c.*
        ,t.""Id"" AS tenant_id
        ,t.*
        ,asset.""Id"" as asset_type_id
        ,asset.*
    FROM ""Invoice"" inv
         INNER JOIN ""InvoiceTerms"" it ON inv.""InvoiceTermsId"" = it.""Id""
         INNER JOIN ""Customer"" c ON inv.""CustomerId"" = c.""EntityId""
         INNER JOIN ""Tenant"" t ON inv.""TenantId"" = t.""Id""
         INNER JOIN ""AssetType"" asset ON t.""DefaultAssetTypeId"" = asset.""Id""
          LEFT JOIN ""InvoiceLineItem"" inv_line_item ON inv.""Id"" = inv_line_item.""InvoiceId""
   WHERE inv.""TenantId"" = @tenantId
     AND ( @includeCustomers::UUID[] IS NULL OR inv.""CustomerId"" = ANY ( @includeCustomers ) )
     AND ( @dateRangeStart::TIMESTAMP IS NULL OR inv.""IssueDate"" >= @dateRangeStart )
     AND ( @dateRangeEnd::TIMESTAMP IS NULL OR inv.""IssueDate"" <= @dateRangeEnd )
GROUP BY inv.""Id""
        ,inv.""TenantId""
        ,inv.""InvoiceNumber""
        ,inv.""Status""
        ,inv.""CustomerId""
        ,inv.""CustomerEmail""
        ,inv.""CustomerAddress""
        ,inv.""InvoiceTermsId""
        ,inv.""IssueDate""
        ,inv.""DueDate""
        ,inv.""Message""
        ,inv.""PaymentId""
        ,inv.""Created""
        ,inv.""CreatedById""
        ,inv.""Updated""
        ,inv.""UpdatedById""
        ,it.""Id""
        ,it.""TenantId""
        ,it.""Name""
        ,it.""DueInDays""
        ,it.""DueOnDayOfMonth""
        ,it.""DueNextMonthThreshold""
        ,it.""Created""
        ,it.""CreatedById""
        ,it.""Updated""
        ,it.""UpdatedById""
        ,c.""EntityId""
        ,c.""TenantId""
        ,c.""CustomerNumber""
        ,c.""NormalizedCustomerNumber""
        ,c.""CompanyName""
        ,c.""NormalizedCompanyName""
        ,c.""DisplayName""
        ,c.""ContactPersonTitle""
        ,c.""ContactPersonFirstName""
        ,c.""ContactPersonMiddleName""
        ,c.""ContactPersonLastName""
        ,c.""ContactPersonNickName""
        ,c.""ContactPersonSuffix""
        ,c.""BillingAddressId""
        ,c.""ShippingAddressId""
        ,c.""IsShippingAddressSameAsBillingAddress""
        ,c.""Email""
        ,c.""WorkPhoneNumber""
        ,c.""MobilePhoneNumber""
        ,c.""FaxNumber""
        ,c.""OtherPhoneNumber""
        ,c.""Website""
        ,c.""Notes""
        ,t.""Id""
        ,t.""Name""
        ,t.""DefaultAssetTypeId""
        ,asset.""Id""
        ,asset.""Name""
        ,asset.""Symbol""
        ,asset.""Description""
ORDER BY inv.""IssueDate"" DESC
  OFFSET @offset
  LIMIT @limit;
";
            const string resultsCountSql = @"
  SELECT COUNT(1)
    FROM ""Invoice"" inv
   WHERE inv.""TenantId"" = @tenantId
     AND ( @includeCustomers::UUID[] IS NULL OR inv.""CustomerId"" = ANY ( @includeCustomers ) )
     AND ( @dateRangeStart::TIMESTAMP IS NULL OR inv.""IssueDate"" >= @dateRangeStart )
     AND ( @dateRangeEnd::TIMESTAMP IS NULL OR inv.""IssueDate"" <= @dateRangeEnd )
";
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                var parameters = new
                {
                    tenantId,
                    dateRangeStart,
                    dateRangeEnd,
                    includeCustomers = includeCustomers.AsArrayOrNull(),
                    offset = pagination.Offset,
                    limit = pagination.Limit,
                };

                var results = await connection.QueryAsync<
                    Invoice,
                    InvoiceTerms,
                    Customer,
                    Tenant,
                    AssetType,
                    Invoice
                >(
                    resultsSelectSql,
                    (invoice, invoiceTerms, customer, tenant, tenantDefaultAssetType) =>
                    {
                        if (invoice != null)
                        {
                            invoice.InvoiceTerms = invoiceTerms;
                            invoice.Customer = customer;
                            invoice.Tenant = tenant;

                            if (tenant != null)
                            {
                                invoice.Tenant.DefaultAssetType = tenantDefaultAssetType;
                            }
                        }

                        return invoice;
                    },
                    parameters,
                    splitOn: "invoice_id,invoice_terms_id,customer_id,tenant_id,asset_type_id");

                var resultsTotalCount = await connection.QuerySingleAsync<int>(resultsCountSql, parameters);

                return new PagedResult<Invoice>(pagination, results, resultsTotalCount);
            }
        }

        public async Task<uint> GetNextInvoiceNumberAsync(Guid tenantId)
        {
            var maxCurrentInvoiceNumber = await _db
                .Invoice
                .Where(inv => inv.TenantId == tenantId)
                .Select(inv => inv.InvoiceNumber)
                .MaxAsync<uint, uint?>(invNum => invNum) ?? 0;

            return ++maxCurrentInvoiceNumber;
        }

        // TODO/FIXME: Might want this operation transactional with creating the Payment
        public async Task<Invoice> MarkInvoicePaidAsync(
            Guid tenantId,
            uint invoiceNumber,
            Guid paymentId,
            Guid contextUserId)
        {
            var invoiceToUpdate = await _db.Invoice.FirstOrDefaultAsync(i =>
                i.TenantId == tenantId &&
                i.InvoiceNumber == invoiceNumber);

            if (invoiceToUpdate == null)
                return null;

            invoiceToUpdate.Status = InvoiceStatus.Paid;
            invoiceToUpdate.PaymentId = paymentId;
            invoiceToUpdate.Updated = DateTime.UtcNow;
            invoiceToUpdate.UpdatedById = contextUserId;

            await _db.SaveChangesAsync();

            return await GetDetailedByIdAsync(invoiceToUpdate.Id);
        }

        public async Task<Invoice> UpdateCompleteInvoiceAsync(Invoice invoice, Guid contextUserId)
        {
            var invoiceToUpdate = await _db.Invoice.FirstOrDefaultAsync(i => i.Id == invoice.Id);

            if (invoiceToUpdate == null)
                return null;

            if (invoiceToUpdate.Status != InvoiceStatus.Draft)
                throw new InvalidOperationException($"It is only permitted to do complete updates on Draft Invoices.  Invoice {invoice.InvoiceNumber} is currently in status '{invoice.Status}'");

            using (var transaction = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    invoiceToUpdate.CustomerAddress = invoice.CustomerAddress;
                    invoiceToUpdate.CustomerEmail = invoice.CustomerEmail;
                    invoiceToUpdate.DueDate = invoice.DueDate;
                    invoiceToUpdate.IssueDate = invoice.IssueDate;
                    invoiceToUpdate.InvoiceTermsId = invoice.InvoiceTermsId;
                    invoiceToUpdate.Message = invoice.Message;
                    invoiceToUpdate.Updated = DateTime.UtcNow;
                    invoiceToUpdate.UpdatedById = contextUserId;
                    invoiceToUpdate.LineItems = invoice.LineItems; // TODO: Might need more specific logic here, to handle audit properties!

                    await _db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return await GetDetailedByIdAsync(invoice.Id);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<Invoice> UpdateInvoiceStatusAsync(
            Guid tenantId,
            uint invoiceNumber,
            InvoiceStatus newStatus,
            Guid contextUserId)
        {
            var invoiceToUpdate = await _db.Invoice.FirstOrDefaultAsync(i =>
                i.TenantId == tenantId &&
                i.InvoiceNumber == invoiceNumber);

            if (invoiceToUpdate == null)
                return null;

            invoiceToUpdate.Status = newStatus;
            invoiceToUpdate.Updated = DateTime.UtcNow;
            invoiceToUpdate.UpdatedById = contextUserId;

            await _db.SaveChangesAsync();

            return await GetDetailedByIdAsync(invoiceToUpdate.Id);
        }
    }
}
