using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface IPaymentBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<Payment>> CreatePayment(Payment payment);
    }
}
