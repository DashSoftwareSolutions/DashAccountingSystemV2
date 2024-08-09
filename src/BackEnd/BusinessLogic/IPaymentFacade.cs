using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface IPaymentFacade : IBusinessLogicFacade
    {
        Task<BusinessLogicResponse<Payment>> CreatePayment(PaymentCreationRequestDto paymentCreationRequest);
    }
}
