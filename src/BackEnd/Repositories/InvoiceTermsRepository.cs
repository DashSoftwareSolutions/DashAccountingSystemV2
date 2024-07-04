using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Repositories
{
    public class InvoiceTermsRepository : IInvoiceTermsRepository
    {
        private readonly ApplicationDbContext _db = null;

        public InvoiceTermsRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task DeleteAsync(Guid invoiceTermsId, Guid contextUserId)
        {
            // TODO: For now, this is a _HARD_ delete.  Perhaps in the future we can consider soft-deletion if it makes sense (e.g. "Oops; I deleted it by accident!  Undo that please!")
            var itemToDelete = await _db.InvoiceTerms.FirstOrDefaultAsync(it => it.Id == invoiceTermsId);

            if (itemToDelete != null)
            {
                // Don't allow deletion of common ones
                if (!itemToDelete.TenantId.HasValue)
                    return;

                _db.InvoiceTerms.Remove(itemToDelete);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<InvoiceTerms> GetByIdAsync(Guid invoiceTermsId)
        {
            return await _db.InvoiceTerms.FirstOrDefaultAsync(it => it.Id == invoiceTermsId);
        }

        public async Task<IEnumerable<InvoiceTerms>> GetInvoiceTermsChoicesAsync(Guid tenantId)
        {
            return await _db.InvoiceTerms
                .Where(it => it.TenantId == null || it.TenantId == tenantId)
                .OrderBy(it => it.Name)
                .ToListAsync();
        }

        public async Task<InvoiceTerms> InsertAsync(InvoiceTerms invoiceTerms)
        {
            await _db.InvoiceTerms.AddAsync(invoiceTerms);
            await _db.SaveChangesAsync();
            return await GetByIdAsync(invoiceTerms.Id);
        }

        public async Task<InvoiceTerms> UpdateAsync(InvoiceTerms invoiceTerms, Guid contextUserId)
        {
            var invoiceTermsToUpdate = await _db.InvoiceTerms.FirstOrDefaultAsync(it => it.Id == invoiceTerms.Id);

            if (invoiceTermsToUpdate != null)
            {
                invoiceTermsToUpdate.Name = invoiceTerms.Name;
                invoiceTermsToUpdate.DueInDays = invoiceTerms.DueInDays;
                invoiceTermsToUpdate.DueOnDayOfMonth = invoiceTerms.DueOnDayOfMonth;
                invoiceTermsToUpdate.DueNextMonthThreshold = invoiceTerms.DueNextMonthThreshold;

                invoiceTermsToUpdate.Updated = DateTime.UtcNow.Unkind();
                invoiceTermsToUpdate.UpdatedById = contextUserId;

                await _db.SaveChangesAsync();
                return await GetByIdAsync(invoiceTermsToUpdate.Id);
            }

            return null;
        }
    }
}
