using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentFacade _paymentBusinessLogicFacade;

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
