using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class ReportAccountResponseViewModel
    {
        public Guid Id { get; set; }

        public ushort AccountNumber { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public LookupValueViewModel AccountType { get; set; }

        public LookupValueViewModel AccountSubType { get; set; }

        public AssetTypeViewModel AssetType { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public AmountType NormalBalanceType { get; set; }

        public AmountViewModel Balance { get; set; }

        public static ReportAccountResponseViewModel FromModel(AccountWithBalanceDto accountWithBalance)
        {
            if (accountWithBalance == null)
                return null;

            return new ReportAccountResponseViewModel()
            {
                Id = accountWithBalance.Account.Id,
                AccountNumber = accountWithBalance.Account.AccountNumber,
                Name = accountWithBalance.Account.Name,
                Description = accountWithBalance.Account.Description,
                AccountType = new LookupValueViewModel(accountWithBalance.Account.AccountTypeId, accountWithBalance.Account.AccountType.Name),
                AccountSubType = new LookupValueViewModel(accountWithBalance.Account.AccountSubTypeId, accountWithBalance.Account.AccountSubType.Name),
                AssetType = AssetTypeViewModel.FromModel(accountWithBalance.Account.AssetType),
                NormalBalanceType = accountWithBalance.Account.NormalBalanceType,
                Balance = new AmountViewModel(accountWithBalance.CurrentBalance, accountWithBalance.Account.AssetType),
            };
        }
    }
}
