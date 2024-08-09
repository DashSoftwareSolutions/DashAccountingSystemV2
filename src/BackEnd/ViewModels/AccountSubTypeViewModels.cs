using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class AccountSubTypeViewModel : LookupValueViewModel
    {
        public int AccountTypeId { get; set; }

        public string AccountType { get; set; }

        public static AccountSubTypeViewModel FromModel(AccountSubType accountSubType)
        {
            if (accountSubType == null)
                return null;

            return new AccountSubTypeViewModel()
            {
                Id = accountSubType.Id,
                Name = accountSubType.Name,
                AccountTypeId = accountSubType.AccountType?.Id ?? 0,
                AccountType = accountSubType.AccountType?.Name ?? "Unknown",
            };
        }
    }
}
