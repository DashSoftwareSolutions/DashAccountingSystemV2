using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class LedgerBusinessLogic : ILedgerBusinessLogic
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IJournalEntryRepository _journalEntryRepository;

        public LedgerBusinessLogic(
            IAccountRepository accountRepository,
            IJournalEntryRepository journalEntryRepository)
        {
            _accountRepository = accountRepository;
            _journalEntryRepository = journalEntryRepository;
        }

        public async Task<BusinessLogicResponse<IEnumerable<LedgerReportAccountDto>>> GetLedgerReport(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd)
        {
            var accounts = await _accountRepository.GetAccountsByTenantAsync(tenantId);

            var accountBalancesDateRangeEnd = dateRangeStart.AddDays(-1);
            var profitAndLossAccountBalancesStartDate = new DateTime(dateRangeStart.Year, 1, 1);

            var balanceSheetAccountStartingBalances = await _accountRepository.GetAccountBalancesAsync(
                tenantId,
                accountBalancesDateRangeEnd,
                [KnownAccountType.Assets, KnownAccountType.Liabilities, KnownAccountType.OwnersEquity]);

            var profitAndLossAccountStartingBalances = await _accountRepository.GetAccountBalancesAsync(
                tenantId,
                profitAndLossAccountBalancesStartDate,
                accountBalancesDateRangeEnd,
                [KnownAccountType.Revenue, KnownAccountType.Expenses]);

            var accountStartingBalances = new Dictionary<Guid, decimal>()
                .Concat(balanceSheetAccountStartingBalances)
                .Concat(profitAndLossAccountStartingBalances)
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            var journalEntryAccounts = await _journalEntryRepository.GetJournalEntryAccountsAsync(
                tenantId,
                dateRangeStart,
                dateRangeEnd);

            var results = accounts.Select(a => new LedgerReportAccountDto()
            {
                Account = a,
                StartingBalance = accountStartingBalances[a.Id],
                Transactions = journalEntryAccounts.Where(jeAcct => jeAcct.AccountId == a.Id),
            });

            return new BusinessLogicResponse<IEnumerable<LedgerReportAccountDto>>(results);
        }
    }
}
