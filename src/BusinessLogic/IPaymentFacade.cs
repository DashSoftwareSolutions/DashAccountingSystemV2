using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface IPaymentFacade : IBusinessLogicFacade
    {
        Task<BusinessLogicResponse<Payment>> CreatePayment(PaymentCreationRequestDto paymentCreationRequest);
    }
}
