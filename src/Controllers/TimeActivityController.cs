using System;
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

        [HttpGet("{tenantId:guid}/time-activities-report")]
        public Task<IActionResult> GetTimeActivitiesDetailReport(
            [FromRoute] Guid tenantId,
            [FromQuery] string dateRangeStart,
            [FromQuery] string dateRangeEnd,
            [FromQuery] string customers = null,
            [FromQuery] string employees = null)
        {
            var parsedDateRangeStart = dateRangeStart.TryParseAsDateTime();

            if (!parsedDateRangeStart.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeStart was not a valid date/time value"));

            var parsedDateRangeEnd = dateRangeEnd.TryParseAsDateTime();

            if (!parsedDateRangeEnd.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeEnd was not a valid date/time value"));

            var parsedCustomerIds = customers.ParseCommaSeparatedValues();
            var parsedEmployeeIds = employees.ParseCommaSeparatedIds();

            var bizLogicResponse = _timeActivityBusinessLogic.GetTimeActivitiesDetailReportData(
                tenantId,
                dateRangeStart: parsedDateRangeStart.Value,
                dateRangeEnd: parsedDateRangeEnd.Value,
                includeCustomers: !parsedCustomerIds.HasAny() ? null : parsedCustomerIds,
                includeEmployees: !parsedEmployeeIds.HasAny() ? null : parsedEmployeeIds);

            return this.Result(bizLogicResponse, TimeActivitiesReportResponseViewModel.FromModel);
        }
    }
}
