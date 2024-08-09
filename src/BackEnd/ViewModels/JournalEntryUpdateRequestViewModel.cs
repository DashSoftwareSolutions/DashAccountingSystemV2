using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class JournalEntryUpdateRequestViewModel : JournalEntryCreateRequestViewModel
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public uint EntryId { get; set; }

        public static JournalEntry? ToModel(JournalEntryUpdateRequestViewModel viewModel, Guid contextUserId)
        {
            if (viewModel == null)
                return null;

            var result = new JournalEntry(
                viewModel.TenantId,
                viewModel.EntryId,
                viewModel.EntryDate.AsUtc(),
                viewModel.PostDate.AsUtc(),
                viewModel.Description,
                viewModel.CheckNumber,
                contextUserId,
                viewModel.PostDate.HasValue ? contextUserId : null);

            result.Id = viewModel.Id;

            if (!string.IsNullOrWhiteSpace(viewModel.Note))
                result.Note = viewModel.Note;

            result.Accounts = viewModel
                .Accounts
                .Select((acct) => new JournalEntryAccount(
                    viewModel.Id,
                    acct.AccountId,
                    acct.Amount.Amount ?? 0.0m,
                    acct.Amount.AssetType.Id))
                .ToArray();

            return result;
        }
    }
}
