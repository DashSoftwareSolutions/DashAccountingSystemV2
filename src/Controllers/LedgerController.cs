using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.Security.Authorization;
using DashAccountingSystemV2.BusinessLogic;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.ViewModels;

namespace DashAccountingSystemV2.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/ledger")]
    public class LedgerController : ControllerBase
    {
        private readonly IAccountBusinessLogic _accountBusinessLogic;

        public LedgerController(
            IAccountBusinessLogic accountBusinessLogic)
        {
            _accountBusinessLogic = accountBusinessLogic;
        }

        [HttpGet("{tenantId:guid}/accounts")]
        public Task<IActionResult> GetAccounts(
            [FromRoute] Guid tenantId,
            [FromQuery] string? date = null)
        {
            var dateForAccountBalances = date.TryParseAsDateTime() ?? DateTime.Today;
            var accountsBizLogicResponse = _accountBusinessLogic.GetAccounts(tenantId, dateForAccountBalances);

            return this.Result(accountsBizLogicResponse, AccountResponseViewModel.FromModel);
        }
    }
}
