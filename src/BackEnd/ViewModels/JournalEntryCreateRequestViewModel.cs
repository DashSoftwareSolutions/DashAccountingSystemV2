using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class JournalEntryCreateRequestViewModel
    {
        [Required]
        public Guid TenantId { get; set; }

        [DataType(DataType.Date)]
        [JsonConverter(typeof(JsonDateConverter))]
        [Required]
        public DateTime EntryDate { get; set; }

        [DataType(DataType.Date)]
        [JsonConverter(typeof(JsonNullableDateConverter))]
        public DateTime? PostDate { get; set; }

        [MaxLength(2048)]
        [Required(AllowEmptyStrings = false)]
        public string Description { get; set; } = string.Empty;

        public string? Note { get; set; }

        public uint? CheckNumber { get; set; }

        [Required]
        public IEnumerable<JournalEntryAccountCreateRequestViewModel> Accounts { get; set; } = [];

        public bool Validate(ModelStateDictionary modelState)
        {
            if (Accounts.IsEmpty())
            {
                modelState.AddModelError("Accounts", "Journal Entry does not have any accounts");
                return false;
            }

            if (Accounts.Count() < 2)
            {
                modelState.AddModelError("Accounts", "Journal Entry has fewer than two account entries");
                return false;
            }

            if (Accounts.Any(acct => !acct.Amount.HasValue))
            {
                modelState.AddModelError("Accounts", "Journal Entry has one or more accounts with invalid amounts or asset types");
                return false;
            }

            var accountsGroupedByAssetType = Accounts
                .GroupBy(acct => new { AssetTypeId = acct.Amount.AssetType.Id, AssetTypeName = acct.Amount.AssetType.Name })
                .ToDictionary(grp => grp.Key, grp => grp.Select(a => a));

            if (accountsGroupedByAssetType.Count > 1)
            {
                modelState.AddModelError(
                    "Accounts",
                    $"Journal Entry has accounts with multiple asset types: {string.Join(" ", accountsGroupedByAssetType.Keys.Select(x => x.AssetTypeName))}.  All accounts must be of the same asset type and must match the default asset type for this company.");

                return false;
            }

            var totalDebits = Accounts.Where(a => a.Amount.AmountType == AmountType.Debit).Sum(a => a.Amount.Amount.Value);
            var totalCredits = Accounts.Where(a => a.Amount.AmountType == AmountType.Credit).Sum(a => a.Amount.Amount.Value);

            if (Math.Abs(totalDebits) != Math.Abs(totalCredits))
            {
                modelState.AddModelError(
                    "Accounts",
                    $"Journal Entry accounts is not balanced.  Debits: {totalDebits.ToString("N2")}  Credits: {totalCredits.ToString("N2")}");
            }

            return modelState.IsValid;
        }

        public static JournalEntry ToModel(JournalEntryCreateRequestViewModel viewModel, Guid contextUserId)
        {
            if (viewModel == null)
                return null;

            var result = new JournalEntry(
                viewModel.TenantId,
                viewModel.EntryDate.AsUtc(),
                viewModel.PostDate.AsUtc(),
                viewModel.Description,
                viewModel.CheckNumber,
                contextUserId,
                viewModel.PostDate.HasValue ? contextUserId : null);

            if (!string.IsNullOrWhiteSpace(viewModel.Note))
                result.Note = viewModel.Note;

            result.Accounts = viewModel
                .Accounts
                .Select(JournalEntryAccountCreateRequestViewModel.ToModel)
                .ToArray();

            return result;
        }
    }
}
