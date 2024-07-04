using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class JournalEntryAccountCreateRequestViewModel
    {
        [Required]
        public Guid AccountId { get; set; }

        [Required]
        public AmountViewModel Amount { get; set; }

        public static JournalEntryAccount ToModel(JournalEntryAccountCreateRequestViewModel viewModel)
        {
            if (viewModel == null ||
                !viewModel.Amount.HasValue)
                return null;

            return new JournalEntryAccount(
                viewModel.AccountId,
                viewModel.Amount.Amount ?? 0.0m,
                viewModel.Amount.AssetType.Id);
        }
    }
}
