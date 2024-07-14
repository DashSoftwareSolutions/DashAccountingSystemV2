using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface IPaymentBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<Payment>> CreatePayment(Payment payment);
    }
}
