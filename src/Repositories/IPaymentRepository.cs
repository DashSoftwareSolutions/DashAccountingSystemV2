using System;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface IPaymentRepository
    {
        public Task DeleteAsync(Guid paymentId, Guid contextUserId);

        public Task<Payment> GetByIdAsync(Guid paymentId);

        public Task<Payment> InsertAsync(Payment payment);
    }
}
