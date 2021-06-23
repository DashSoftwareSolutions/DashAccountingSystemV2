using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
{
    public class JournalEntryCreateRequestViewModel
    {
        [Required]
        public Guid TenantId { get; set; }

        [DataType(DataType.Date)]
        [Required]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime EntryDate { get; set; }

        [DataType(DataType.Date)]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime? PostDate { get; set; }

        [MaxLength(2048)]
        [Required(AllowEmptyStrings = false)]
        public string Description { get; set; }

        public string Note { get; set; }

        public uint? CheckNumber { get; set; }

        [Required]
        public IEnumerable<JournalEntryAccountCreateRequestViewModel> Accounts { get; set; }

        public bool Validate(ModelStateDictionary modelState)
        {
            if (Accounts.IsEmpty())
                modelState.AddModelError("Accounts", "Journal Entry does not have any accounts");

            if (Accounts.Any(acct => !acct.Amount.HasValue))
                modelState.AddModelError("Accounts", "Journal Entry has one or more accounts with invalid amounts or asset types");

            var accountsGroupedByAssetType = Accounts
                .GroupBy(acct => new { AssetTypeId = acct.Amount.AssetType.Id, AssetTypeName = acct.Amount.AssetType.Name })
                .ToDictionary(grp => grp.Key, grp => grp.Select(a => a));

            var deficientAssetTypeGroups = accountsGroupedByAssetType
                .Where(assetTypeGroup => assetTypeGroup.Value.Count() < 2);

            if (deficientAssetTypeGroups.Any())
                foreach (var assetTypeGroup in deficientAssetTypeGroups)
                {
                    modelState.AddModelError(
                        "Accounts",
                        $"Journal Entry has fewer than two account entries of asset type '{assetTypeGroup.Key.AssetTypeName}'");
                }

            var unbalancedAssetTypeGroups = accountsGroupedByAssetType
                .Where(assetTypeGroup =>
                    Math.Abs(assetTypeGroup.Value.Where(a => a.Amount.AmountType == AmountType.Debit).Sum(a => a.Amount.Amount.Value)) !=
                    Math.Abs(assetTypeGroup.Value.Where(a => a.Amount.AmountType == AmountType.Credit).Sum(a => a.Amount.Amount.Value)));

            if (unbalancedAssetTypeGroups.Any())
            {
                foreach (var assetTypeGroup in unbalancedAssetTypeGroups)
                {
                    modelState.AddModelError(
                        "Accounts",
                        $"Journal Entry accounts do not balance for asset type '{assetTypeGroup.Key.AssetTypeName}'");
                }
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

            result.Accounts = viewModel
                .Accounts
                .Select(JournalEntryAccountCreateRequestViewModel.ToModel)
                .ToArray();

            return result;
        }
    }
}
