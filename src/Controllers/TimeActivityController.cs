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
    [Route("api/time-tracking")]
    public class TimeActivityController : Controller
    {
        private readonly ITimeActivityBusinessLogic _timeActivityBusinessLogic = null;

        public TimeActivityController(ITimeActivityBusinessLogic timeActivityBusinessLogic)
        {
            _timeActivityBusinessLogic = timeActivityBusinessLogic;
        }

        [HttpPost("time-activity")]
        public Task<IActionResult> CreateTimeActivity([FromBody] TimeActivityCreateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid POST body"));

            if (!ModelState.IsValid)
                return Task.FromResult(this.ErrorResponse(ModelState));

            var timeActivityToCreate = TimeActivityCreateRequestViewModel.ToModel(viewModel);
            timeActivityToCreate.CreatedById = User.GetUserId();

            var createTimeActivityBizLogicResponse = _timeActivityBusinessLogic.CreateTimeActivity(timeActivityToCreate);

            return this.Result(createTimeActivityBizLogicResponse, TimeActivityResponseViewModel.FromModel);
        }
    }
}
