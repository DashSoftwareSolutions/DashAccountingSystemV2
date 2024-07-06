using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class LedgerAccountResponseViewModel
    {
        public Guid Id { get; set; }

        public ushort AccountNumber { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public LookupValueViewModel AccountType { get; set; }

        public AssetTypeViewModel AssetType { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<AmountType>))]
        public AmountType NormalBalanceType { get; set; }

        public AmountViewModel StartingBalance { get; set; }

        public IEnumerable<LedgerAccountTransactionResponseViewModel> Transactions { get; set; }

        public static LedgerAccountResponseViewModel FromModel(LedgerReportAccountDto ledgerReportAccountDto)
        {
            if (ledgerReportAccountDto == null)
                return null;

            var viewModel = new LedgerAccountResponseViewModel()
            {
                Id = ledgerReportAccountDto.Account.Id,
                AccountNumber = ledgerReportAccountDto.Account.AccountNumber,
                Name = ledgerReportAccountDto.Account.Name,
                Description = ledgerReportAccountDto.Account.Description,
                AccountType = new LookupValueViewModel(ledgerReportAccountDto.Account.AccountType.Id, ledgerReportAccountDto.Account.AccountType.Name),
                AssetType = AssetTypeViewModel.FromModel(ledgerReportAccountDto.Account.AssetType),
                NormalBalanceType = ledgerReportAccountDto.Account.NormalBalanceType,
                StartingBalance = new AmountViewModel(ledgerReportAccountDto.StartingBalance, ledgerReportAccountDto.Account.AssetType),
            };

            var transactionsList = new List<LedgerAccountTransactionResponseViewModel>();

            var runningBalance = ledgerReportAccountDto.StartingBalance;

            if (ledgerReportAccountDto.Transactions.HasAny())
            {
                foreach (var transaction in ledgerReportAccountDto.Transactions)
                {
                    var txViewModel = LedgerAccountTransactionResponseViewModel.FromModel(transaction);
                    runningBalance += transaction.Amount;
                    txViewModel.UpdatedBalance = new AmountViewModel(runningBalance, transaction.AssetType);
                    transactionsList.Add(txViewModel);
                }
            }

            viewModel.Transactions = transactionsList;

            return viewModel;
        }
    }
}
