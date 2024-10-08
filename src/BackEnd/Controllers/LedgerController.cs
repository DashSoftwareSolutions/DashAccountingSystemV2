using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Services.Export;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/ledger")]
    public class LedgerController(
        IAccountBusinessLogic accountBusinessLogic,
        IAccountingReportBusinessLogic accountingReportBusinessLogic,
        ILedgerBusinessLogic ledgerBusinessLogic,
        IExportService exportService) : ControllerBase
    {
        [HttpGet("{tenantId:guid}/accounts")]
        public Task<IActionResult> GetAccounts(
            [FromRoute] Guid tenantId,
            [FromQuery] string? date = null)
        {
            var dateForAccountBalances = date.TryParseAsDateTime() ?? DateTime.Today;
            var accountsBizLogicResponse = accountBusinessLogic.GetAccounts(tenantId, dateForAccountBalances);

            return this.Result(accountsBizLogicResponse, AccountResponseViewModel.FromModel);
        }

        [HttpGet("{tenantId:guid}/report")]
        public Task<IActionResult> GetLedgerReport(
            [FromRoute] Guid tenantId,
            [FromQuery] string dateRangeStart,
            [FromQuery] string dateRangeEnd)
        {
            var parsedDateRangeStart = dateRangeStart.TryParseAsDateTime();

            if (!parsedDateRangeStart.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeStart was not a valid date/time value"));

            var parsedDateRangeEnd = dateRangeEnd.TryParseAsDateTime();

            if (!parsedDateRangeEnd.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeEnd was not a valid date/time value"));

            var bizLogicResponse = ledgerBusinessLogic.GetLedgerReport(tenantId, parsedDateRangeStart.Value, parsedDateRangeEnd.Value);

            return this.Result(bizLogicResponse, LedgerAccountResponseViewModel.FromModel);
        }

        [HttpGet("{tenantId:guid}/balance-sheet")]
        public Task<IActionResult> GetBalanceSheetReport(
             [FromRoute] Guid tenantId,
             [FromQuery] string dateRangeStart,
             [FromQuery] string dateRangeEnd)
        {
            var parsedDateRangeStart = dateRangeStart.TryParseAsDateTime();

            if (!parsedDateRangeStart.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeStart was not a valid date/time value"));

            var parsedDateRangeEnd = dateRangeEnd.TryParseAsDateTime();

            if (!parsedDateRangeEnd.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeEnd was not a valid date/time value"));

            var balanceSheetReportBizLogicResponse = accountingReportBusinessLogic.GetBalanceSheetReport(
                tenantId,
                parsedDateRangeStart.Value,
                parsedDateRangeEnd.Value);

            return this.Result(
                balanceSheetReportBizLogicResponse,
                (BalanceSheetReportDto reportData) =>
                {
                    var viewModel = BalanceSheetReportResponseViewModel.FromModel(reportData);

                    if (viewModel != null)
                    {
                        viewModel.ReportDates = new ReportDatesResponseViewModel(
                            parsedDateRangeStart.Value,
                            parsedDateRangeEnd.Value);
                    }

                    return viewModel;
                });
        }

        [HttpGet("{tenantId:guid}/profit-and-loss")]
        public Task<IActionResult> GetProfitAndLossReport(
            [FromRoute] Guid tenantId,
            [FromQuery] string dateRangeStart,
            [FromQuery] string dateRangeEnd)
        {
            var parsedDateRangeStart = dateRangeStart.TryParseAsDateTime();

            if (!parsedDateRangeStart.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeStart was not a valid date/time value"));

            var parsedDateRangeEnd = dateRangeEnd.TryParseAsDateTime();

            if (!parsedDateRangeEnd.HasValue)
                return Task.FromResult(this.ErrorResponse("dateRangeEnd was not a valid date/time value"));

            var profitAndLossReportBizLogicResponse = accountingReportBusinessLogic.GetProfitAndLossReport(
                tenantId,
                parsedDateRangeStart.Value,
                parsedDateRangeEnd.Value);

            return this.Result(
                profitAndLossReportBizLogicResponse,
                (ProfitAndLossReportDto reportData) =>
                {
                    var viewModel = ProfitAndLossReportResponseViewModel.FromModel(reportData);

                    if (viewModel != null)
                    {
                        viewModel.ReportDates = new ReportDatesResponseViewModel(
                            parsedDateRangeStart.Value,
                            parsedDateRangeEnd.Value);
                    }

                    return viewModel;
                });
        }

        [HttpPost("export-balance-sheet")]
        public Task<IActionResult> RequestBalanceSheetExport([FromBody] ExportRequestWithDateRangeViewModel viewModel)
        {
            return RequestReportExport(viewModel, accountingReportBusinessLogic.GetBalanceSheetReport);
        }

        [HttpPost("export-profit-and-loss")]
        public Task<IActionResult> RequestProfitAndLossReportExport([FromBody] ExportRequestWithDateRangeViewModel viewModel)
        {
            return RequestReportExport(viewModel, accountingReportBusinessLogic.GetProfitAndLossReport);
        }

        private async Task<IActionResult> RequestReportExport<TUnderlyingData>(
            ExportRequestWithDateRangeViewModel viewModel,
            Func<Guid, DateTime, DateTime, Task<BusinessLogicResponse<TUnderlyingData>>> getReportData)
            where TUnderlyingData : class
        {
            if (viewModel == null)
                return this.ErrorResponse("Invalid POST body");

            if (viewModel.ExportFormat == ExportFormat.Unknown)
                return this.ErrorResponse("Export Format was not valid");

            if (viewModel.ExportType == ExportType.Unknown)
                return this.ErrorResponse("Export Type was not valid");

            if (viewModel.TenantId == default(Guid))
                return this.ErrorResponse("Tenant ID was not valid");

            var parsedDateRangeStart = viewModel.DateRangeStart.TryParseAsDateTime();

            if (!parsedDateRangeStart.HasValue)
                return this.ErrorResponse("dateRangeStart was not a valid date/time value");

            var parsedDateRangeEnd = viewModel.DateRangeEnd.TryParseAsDateTime();

            if (!parsedDateRangeEnd.HasValue)
                return this.ErrorResponse("dateRangeEnd was not a valid date/time value");

            var reportDataBizLogicResponse = await getReportData(viewModel.TenantId, parsedDateRangeStart.Value, parsedDateRangeEnd.Value);

            if (!reportDataBizLogicResponse.IsSuccessful)
                return this.ErrorResponse(reportDataBizLogicResponse);

            var exportRequestParams = new ExportRequestParameters()
            {
                ExportFormat = viewModel.ExportFormat,
                ExportType = viewModel.ExportType,
                RequestingUserId = User.GetUserId(),
                TenantId = viewModel.TenantId,
            };

            var exportServiceResponse = await exportService.GetDataExport(exportRequestParams, reportDataBizLogicResponse.Data);

            if (!exportServiceResponse.IsSuccessful)
                return this.ErrorResponse(exportServiceResponse.Error);

            var result = new ExportDescriptorRequestAndResponseViewModel()
            {
                Format = exportServiceResponse.ExportFormat,
                FileName = exportServiceResponse.FileName,
                Token = exportServiceResponse.Token,
            };

            return Ok(result);
        }
    }
}
