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
    [Route("api/ledger")]
    public class LedgerController : Controller
    {
        private readonly IAccountBusinessLogic _accountBusinessLogic = null;
        private readonly ILedgerBusinessLogic _ledgerBusinessLogic = null;

        public LedgerController(
            IAccountBusinessLogic accountBusinessLogic,
            ILedgerBusinessLogic ledgerBusinessLogic)
        {
            _accountBusinessLogic = accountBusinessLogic;
            _ledgerBusinessLogic = ledgerBusinessLogic;
        }

        [HttpGet("{tenantId:guid}/accounts")]
        public Task<IActionResult> GetAccounts(
            [FromRoute] Guid tenantId,
            [FromQuery] string date = null)
        {
            var dateForAccountBalances = date.TryParseAsDateTime() ?? DateTime.Today;
            var accountsBizLogicResponse = _accountBusinessLogic.GetAccounts(tenantId, dateForAccountBalances);

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

            var bizLogicResponse = _ledgerBusinessLogic.GetLedgerReport(tenantId, parsedDateRangeStart.Value, parsedDateRangeEnd.Value);

            return this.Result(bizLogicResponse, LedgerAccountResponseViewModel.FromModel);
        }
    }
}
