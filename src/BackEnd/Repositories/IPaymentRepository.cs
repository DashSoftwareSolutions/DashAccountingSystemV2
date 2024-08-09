using System;
using System.Threading.Tasks;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface IPaymentRepository
    {
        public Task DeleteAsync(Guid paymentId, Guid contextUserId);

        public Task<Payment> GetByIdAsync(Guid paymentId);

        public Task<Payment> InsertAsync(Payment payment);
    }
}
