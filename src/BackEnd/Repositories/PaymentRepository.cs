using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Models;


namespace DashAccountingSystemV2.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _db = null;

        public PaymentRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task DeleteAsync(Guid paymentId, Guid contextUserId)
        {
            // TODO: For now, this is a _HARD_ delete.  Perhaps in the future we can consider soft-deletion if it makes sense (e.g. "Oops; I deleted it by accident!  Undo that please!")
            var paymentToDelete = await _db.Payment.FirstOrDefaultAsync(p => p.Id == paymentId);

            if (paymentToDelete == null)
                return;

            _db.Payment.Remove(paymentToDelete);
            await _db.SaveChangesAsync();
        }

        public async Task<Payment> GetByIdAsync(Guid paymentId)
        {
            return await _db
                .Payment
                .Where(p => p.Id == paymentId)
                .Include(p => p.Tenant)
                .Include(p => p.Customer)
                .Include(p => p.DepositAccount)
                    .ThenInclude(a => a.AccountType)
                .Include(p => p.DepositAccount)
                    .ThenInclude(a => a.AccountSubType)
                .Include(p => p.RevenueAccount)
                    .ThenInclude(a => a.AccountType)
                .Include(p => p.RevenueAccount)
                    .ThenInclude(a => a.AccountSubType)
                .Include(p => p.Invoices)
                    .ThenInclude(ip => ip.Invoice)
                .Include(p => p.PaymentMethod)
                .Include(p => p.AssetType)
                .Include(p => p.JournalEntry)
                .Include(p => p.CreatedBy)
                .Include(p => p.UpdatedBy)
                .FirstOrDefaultAsync();
        }

        public async Task<Payment> InsertAsync(Payment payment)
        {
            await _db.Payment.AddAsync(payment);
            await _db.SaveChangesAsync();
            return await GetByIdAsync(payment.Id);
        }
    }
}
