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
                return Task.FromResult(this.ErrorResponse("Invalid POST body."));

            if (!ModelState.IsValid)
                return Task.FromResult(this.ErrorResponse(ModelState));

            var timeActivityToCreate = TimeActivityCreateRequestViewModel.ToModel(viewModel);
            timeActivityToCreate.CreatedById = User.GetUserId();

            var createTimeActivityBizLogicResponse = _timeActivityBusinessLogic.CreateTimeActivity(timeActivityToCreate);

            return this.Result(createTimeActivityBizLogicResponse, TimeActivityResponseViewModel.FromModel);
        }

        [HttpPut("time-activity/{timeActivityId:guid}")]
        public Task<IActionResult> UpdateTimeActivity(
            [FromRoute] Guid timeActivityId,
            [FromBody] TimeActivityUpdateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid PUT body."));

            if (timeActivityId != viewModel.Id)
                return Task.FromResult(this.ErrorResponse("The ID in the PUT body does not match the ID in the URL."));

            if (!ModelState.IsValid)
                return Task.FromResult(this.ErrorResponse(ModelState));

            var timeActivityToUpdate = TimeActivityUpdateRequestViewModel.ToModel(viewModel);
            var contextUserId = User.GetUserId();

            var updateTimeActivityBizLogicResponse = _timeActivityBusinessLogic.UpdateTimeActivity(timeActivityToUpdate, contextUserId);

            return this.Result(updateTimeActivityBizLogicResponse, TimeActivityResponseViewModel.FromModel);
        }

        [HttpDelete("time-activity/{timeActivityId:guid}")]
        public Task<IActionResult> DeleteTimeActivity([FromRoute] Guid timeActivityId)
        {
            var contextUserId = User.GetUserId();
            var bizLogicResponse = _timeActivityBusinessLogic.DeleteTimeActivity(timeActivityId, contextUserId);
            return this.Result(bizLogicResponse);
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
                return Task.FromResult(this.ErrorResponse("dateRangeStart was not a valid date/time value."));

            var parsedDateRangeEnd = dateRangeEnd.TryParseAsDateTime();

            if (!parsedDateRangeEnd.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeEnd was not a valid date/time value."));

            var parsedCustomerIds = customers.ParseCommaSeparatedValues();
            var parsedEmployeeIds = employees.ParseCommaSeparatedIntegers();

            var bizLogicResponse = _timeActivityBusinessLogic.GetTimeActivitiesDetailReportData(
                tenantId,
                dateRangeStart: parsedDateRangeStart.Value,
                dateRangeEnd: parsedDateRangeEnd.Value,
                includeCustomers: parsedCustomerIds,
                includeEmployees: parsedEmployeeIds);

            return this.Result(bizLogicResponse, TimeActivitiesReportResponseViewModel.FromModel);
        }

        [HttpGet("{tenantId:guid}/unbilled-time-activities")]
        public Task<IActionResult> GetTimeActivitiesDetailReport(
            [FromRoute] Guid tenantId,
            [FromQuery] string customer,
            [FromQuery] string dateRangeStart,
            [FromQuery] string dateRangeEnd)
        {
            var parsedDateRangeStart = dateRangeStart.TryParseAsDateTime();

            if (!parsedDateRangeStart.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeStart was not a valid date/time value."));

            var parsedDateRangeEnd = dateRangeEnd.TryParseAsDateTime();

            if (!parsedDateRangeEnd.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeEnd was not a valid date/time value."));

            if (parsedDateRangeStart.Value > parsedDateRangeEnd.Value)
                return Task.FromResult(this.ErrorResponse("dateRangeStart must be before or the same as dateRangeEnd."));

            return this.Result(
                _timeActivityBusinessLogic.GetUnbilledTimeActivitiesForInvoicing(
                    tenantId,
                    customer,
                    parsedDateRangeStart.Value,
                    parsedDateRangeEnd.Value),
                TimeActivityResponseViewModel.FromModel);
        }
    }
}
