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
            const string resultsSelectSql = @"
  SELECT inv.""Id"" AS invoice_id
        ,inv.*
        ,c.""EntityId"" AS customer_id
        ,c.*
        ,t.""Id"" AS tenant_id
        ,t.*
        ,at.""Id"" as asset_type_id
        ,at.*
    FROM ""Invoice"" inv
         INNER JOIN ""Customer"" c ON inv.""CustomerId"" = c.""EntityId""
         INNER JOIN ""Tenant"" t ON inv.""TenantId"" = t.""Id""
         INNER JOIN ""AssetType"" at ON t.""DefaultAssetTypeId"" = at.""Id""
   WHERE inv.""TenantId"" = @tenantId
     AND ( @includeCustomers::UUID[] IS NULL OR inv.""CustomerId"" = ANY ( @includeCustomers ) )
     AND ( @dateRangeStart::TIMESTAMP IS NULL OR inv.""IssueDate"" >= @dateRangeStart )
     AND ( @dateRangeEnd::TIMESTAMP IS NULL OR inv.""IssueDate"" <= @dateRangeEnd )
ORDER BY inv.""IssueDate"" DESC
  OFFSET ;
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
                var results
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

        public Task<Invoice> InsertAsync(Invoice invoice)
        {
            throw new NotImplementedException();
        }

        public Task<Invoice> UpdateAsync(Invoice invoice, Guid contextUserId)
        {
            throw new NotImplementedException();
        }
    }
}
