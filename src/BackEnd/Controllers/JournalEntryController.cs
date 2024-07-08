using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Security.Authorization;
using DashAccountingSystemV2.BackEnd.ViewModels;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/journal")]
    public class JournalEntryController : ControllerBase
    {
        private readonly IJournalEntryBusinessLogic _journalEntryBusinessLogic;

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

        [HttpPost("entry")]
        public Task<IActionResult> CreateJournalEntry([FromBody] JournalEntryCreateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid POST body"));

            if (!viewModel.Validate(ModelState))
                return Task.FromResult(this.ErrorResponse(ModelState));

            var contextUserId = User.GetUserId();

            var inboundJournalEntry = JournalEntryCreateRequestViewModel.ToModel(
                viewModel,
                contextUserId);

            var bizLogicResponse = _journalEntryBusinessLogic.CreateJournalEntry(inboundJournalEntry);

            return this.Result(bizLogicResponse, JournalEntryResponseViewModel.FromModel);
        }

        [HttpPut("{tenantId:guid}/entry/{entryId:long:min(1):max(4294967295)}")]
        public Task<IActionResult> UpdateJournalEntry(
            [FromRoute] Guid tenantId,
            [FromRoute] uint entryId,
            [FromBody] JournalEntryUpdateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid PUT body"));

            if (tenantId != viewModel.TenantId ||
                entryId != viewModel.EntryId)
                return Task.FromResult(this.ErrorResponse("Mismatch between route parameters and PUT body"));

            if (!viewModel.Validate(ModelState))
                return Task.FromResult(this.ErrorResponse(ModelState));

            var contextUserId = User.GetUserId();
            var entryWithUpdates = JournalEntryUpdateRequestViewModel.ToModel(viewModel, contextUserId);

            var bizLogicResponse = _journalEntryBusinessLogic.UpdateJournalEntry(
                entryWithUpdates,
                contextUserId);

            return this.Result(bizLogicResponse, JournalEntryResponseViewModel.FromModel);
        }

        [HttpPut("{tenantId:guid}/entry/{entryId:long:min(1):max(4294967295)}/post-date")]
        public Task<IActionResult> PostJournalEntry(
            [FromRoute] Guid tenantId,
            [FromRoute] uint entryId,
            [FromBody] PostJournalEntryRequestViewModel viewModel)
        {
            if (viewModel == null)
                return Task.FromResult(this.ErrorResponse("Invalid PUT body"));

            if (!ModelState.IsValid)
                return Task.FromResult(this.ErrorResponse(ModelState));

            var contextUserId = User.GetUserId();

            var bizLogicResponse = _journalEntryBusinessLogic.PostJournalEntry(
                tenantId,
                entryId,
                viewModel.PostDate.AsUtc(),
                contextUserId,
                !string.IsNullOrWhiteSpace(viewModel.Note) ? viewModel.Note.Trim() : null);

            return this.Result(bizLogicResponse, JournalEntryResponseViewModel.FromModel);
        }

        [HttpDelete("{tenantId:guid}/entry/{entryId:long:min(1):max(4294967295)}")]
        public Task<IActionResult> DeletePendingJournalEntry(
            [FromRoute] Guid tenantId,
            [FromRoute] uint entryId)
        {
            var bizLogicResponse = _journalEntryBusinessLogic.DeletePendingJournalEntryByTenantAndEntryId(tenantId, entryId);
            return this.Result(bizLogicResponse);
        }
    }
}
