using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class LedgerBusinessLogic : ILedgerBusinessLogic
    {
        private readonly IAccountRepository _accountRepository = null;
        private readonly IJournalEntryRepository _journalEntryRepository = null;

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
            var accountStartingBalances = await _accountRepository.GetAccountBalancesAsync(tenantId, dateRangeStart.AddDays(-1));
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
