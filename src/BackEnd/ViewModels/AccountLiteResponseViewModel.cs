using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class AccountLiteResponseViewModel
    {
        public Guid Id { get; set; }

        public uint AccountNumber { get; set; }

        public string AccountName { get; set; }

        public LookupValueViewModel AccountType { get; set; }

        public LookupValueViewModel AccountSubType { get; set; }

        public static AccountLiteResponseViewModel FromModel(Account model)
        {
            if (model == null)
                return null;

            return new AccountLiteResponseViewModel()
            {
                Id = model.Id,
                AccountName = model.Name,
                AccountNumber = model.AccountNumber,
                AccountType = model.AccountType != null ?
                    new LookupValueViewModel(model.AccountType.Id, model.AccountType.Name) :
                    null,
                AccountSubType = model.AccountSubType != null ?
                    new LookupValueViewModel(model.AccountSubType.Id, model.AccountSubType.Name) :
                    null,
            };
        }
    }
}
