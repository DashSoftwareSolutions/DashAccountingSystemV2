using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class AccountResponseViewModel
    {
        public Guid Id { get; set; }

        public ushort AccountNumber { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public LookupValueViewModel AccountType { get; set; }

        public LookupValueViewModel AccountSubType { get; set; }

        public AssetTypeViewModel AssetType { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<AmountType>))]
        public AmountType NormalBalanceType { get; set; }

        public DateTime Created { get; set; }

        public ApplicationUserLiteViewModel CreatedBy { get; set; }

        public DateTime? Updated { get; set; }

        public ApplicationUserLiteViewModel UpdatedBy { get; set; }

        public AmountViewModel Balance { get; set; }

        public bool IsBalanceNormal => Balance.AmountType == NormalBalanceType;

        public static AccountResponseViewModel FromModel(AccountWithBalanceDto account)
        {
            if (account == null || account.Account == null)
                return null;

            return new AccountResponseViewModel()
            {
                Id = account.Account.Id,
                AccountNumber = account.Account.AccountNumber,
                Name = account.Account.Name,
                Description = account.Account.Description,
                AccountType = new LookupValueViewModel(account.Account.AccountType.Id, account.Account.AccountType.Name),
                AccountSubType = new LookupValueViewModel(account.Account.AccountSubType.Id, account.Account.AccountSubType.Name),
                AssetType = AssetTypeViewModel.FromModel(account.Account.AssetType),
                NormalBalanceType = account.Account.NormalBalanceType,
                Created = account.Account.Created.AsUtc(),
                CreatedBy = ApplicationUserLiteViewModel.FromModel(account.Account.CreatedBy),
                Updated = account.Account.Updated.AsUtc(),
                UpdatedBy = ApplicationUserLiteViewModel.FromModel(account.Account.UpdatedBy),
                Balance = new AmountViewModel(account.CurrentBalance, account.Account.AssetType),
            };
        }
    }
}
