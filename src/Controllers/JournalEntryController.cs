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
    [Route("api/journal")]
    public class JournalEntryController : Controller
    {
        private readonly IJournalEntryBusinessLogic _journalEntryBusinessLogic = null;

        public JournalEntryController(IJournalEntryBusinessLogic journalEntryBusinessLogic)
        {
            _journalEntryBusinessLogic = journalEntryBusinessLogic;
        }

        // Cannot use uint as a route parameter type constraint
        // 4294967295 is uint.MaxValue
        // See https://docs.microsoft.com/en-us/aspnet/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#route-constraints
        [HttpGet("{tenantId:guid}/entry/{entryId:long:min(1):max(4294967295)}")]
        public Task<IActionResult> GetJournalEntry(
            [FromRoute] Guid tenantId,
            [FromRoute] uint entryId)
        {
            var bizLogicResponse = _journalEntryBusinessLogic.GetJournalEntryByTenantAndEntryId(
                tenantId,
                entryId);

            return this.Result(bizLogicResponse, JournalEntryResponseViewModel.FromModel);
        }
    }
}
