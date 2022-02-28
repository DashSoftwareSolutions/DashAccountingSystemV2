using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : Controller
    {
        private readonly IPaymentFacade _paymentBusinessLogicFacade = null;

        public PaymentController(IPaymentFacade paymentBusinessLogicFacade)
        {
            _paymentBusinessLogicFacade = paymentBusinessLogicFacade;
        }

        [HttpPost]
        public Task<IActionResult> CreatePayment([FromBody] PaymentCreateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid POST body"));

            var contextUserId = User.GetUserId();
            var bizLogicResponse = _paymentBusinessLogicFacade.CreatePayment(PaymentCreateRequestViewModel.ToModel(viewModel, contextUserId));
            return this.Result(bizLogicResponse, PaymentResponseViewModel.FromModel);
        }
    }
}
