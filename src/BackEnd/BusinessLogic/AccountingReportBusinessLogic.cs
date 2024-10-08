using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Repositories;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class AccountingReportBusinessLogic : IAccountingReportBusinessLogic
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IJournalEntryRepository _journalEntryRepository;
        private readonly ITenantRepository _tenantRepository;
        private readonly ILogger _logger;

        public AccountingReportBusinessLogic(
            IAccountRepository accountRepository,
            IJournalEntryRepository journalEntryRepository,
            ITenantRepository tenantRepository,
            ILogger<AccountingReportBusinessLogic> logger)
        {
            _accountRepository = accountRepository;
            _journalEntryRepository = journalEntryRepository;
            _tenantRepository = tenantRepository;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<BalanceSheetReportDto>> GetBalanceSheetReport(Guid tenantId, DateTime dateRangeStart, DateTime dateRangeEnd)
        {
            _logger.LogDebug("Compiling data for Balance Sheet Report for date range from {0:d} to {1:d}", dateRangeStart, dateRangeEnd);
            _logger.LogDebug("Getting final balances for all Assets, Liabilities and Equities accounts...");

            var tenant = await _tenantRepository.GetTenantAsync(tenantId);
            
            if (tenant == null)
            {
                return new BusinessLogicResponse<BalanceSheetReportDto>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Check that user has access to this tenant and permission for balance sheet data

            var balanceSheetAccountsResponse = await GetAccounts(
                tenantId,
                dateRangeEnd,
                KnownAccountType.Assets,
                KnownAccountType.Liabilities,
                KnownAccountType.OwnersEquity);

            if (!balanceSheetAccountsResponse.IsSuccessful)
                return new BusinessLogicResponse<BalanceSheetReportDto>(balanceSheetAccountsResponse);

            var balanceSheetAccounts = balanceSheetAccountsResponse.Data;

            var assetAccounts = balanceSheetAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Assets);
            var liabilityAccounts = balanceSheetAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Liabilities);
            var equityAccounts = balanceSheetAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.OwnersEquity);

            var totalAssets = assetAccounts.Sum(a => a.CurrentBalance);
            var totalLiabilities = liabilityAccounts.Sum(a => a.CurrentBalance);
            var totalEquity = equityAccounts.Sum(a => a.CurrentBalance);

            _logger.LogDebug("Total Assets: {0:N2}", totalAssets);
            _logger.LogDebug("Total Liabilities: {0:N2}", totalLiabilities);
            _logger.LogDebug("Total Equity: {0:N2}", totalEquity);

            var combinedLiabilityAndEquity = totalLiabilities + totalEquity;

            _logger.LogDebug("Liabilities + Equity: {0:N2}", combinedLiabilityAndEquity);

            // For Net Income and Retained Earnings, we need year-to-date for the specified period.
            // e.g. If the request is "Get the Balance Sheet for 2019 Q2", we want the Net Income for the entire first half of 2019.
            _logger.LogDebug("Fetching revenue and expense transactions for the year containing the specified period...");

            var revenueAndExpenseDateRangeStart = new DateTime(dateRangeStart.Year, 1, 1);

            var revenueAndExpenseTransactions = await _journalEntryRepository.GetPostedJournalEntryAccountsAsync(
                tenantId,
                revenueAndExpenseDateRangeStart,
                dateRangeEnd,
                KnownAccountType.Revenue,
                KnownAccountType.Expenses);

            var totalRevenue = revenueAndExpenseTransactions
                .Where(tx => tx.Account.AccountTypeId == (int)KnownAccountType.Revenue)
                .Sum(tx => tx.Amount);

            var totalExpenses = revenueAndExpenseTransactions
                .Where(tx => tx.Account.AccountTypeId == (int)KnownAccountType.Expenses)
                .Sum(tx => tx.Amount);

            _logger.LogDebug("Total Revenue: {0:N2}", totalRevenue);
            _logger.LogDebug("Total Expenses: {0:N2}", totalExpenses);

            var netIncome = totalRevenue + totalExpenses;

            _logger.LogDebug("Net Income: {0:N2}", netIncome);

            // Assets has a Debit balance (positive)
            // Liabilities and Equities have Credit balances (negative)
            // Net Income normal balance type is Credit (for a Profit) and a loss would be a Debit amount
            var discrepancy = totalAssets + combinedLiabilityAndEquity + netIncome;

            _logger.LogDebug("Discrepancy with Assets: {0:N2}", discrepancy);

            var retainedEarningsAccount = balanceSheetAccounts.FirstOrDefault(a => a.Account.AccountSubTypeId == (int)KnownAccountSubType.RetainedEarnings);
            var hasRetainedEarningsAccount = retainedEarningsAccount != null;

            if (!hasRetainedEarningsAccount)
            {
                _logger.LogWarning("Oh noes!  No Retained Earnings Account!");

                return new BusinessLogicResponse<BalanceSheetReportDto>(
                    new BalanceSheetReportDto()
                    {
                        Tenant = tenant,
                        DateRange = new DateRange(dateRangeStart, dateRangeEnd),
                        Assets = assetAccounts,
                        Liabilities = liabilityAccounts,
                        Equity = equityAccounts,
                        NetIncome = netIncome,
                        TotalAssets = totalAssets,
                        TotalLiabilities = totalLiabilities,
                        TotalEquity = totalEquity,
                        TotalLiabilitiesAndEquity = totalLiabilities + totalEquity + netIncome,
                        Discrepency = discrepancy,
                    });
            }

            // The discrepancy then needs to be added to Retained Earnings
            // Invert the sign, as the amount should be relative to Credit
            // * If we have a positive discrepancy (i.e. Debit / more Assets), we need to _increase_ the Retained Earnings amount by adding an additional negative (Credit) amount
            // * If we have a negative discrepancy (i.e. Credit / more Liabilities and Equities), we need to _decrease_ the Retained Earnings amount by adding an additional positive (Debit) amount
            // TODO: After checking again, I noticed QuickBooks seems to consider Retained Earnings to be updated yearly.  Need to see if I can mimic that.
            var adjustedDiscrepancy = discrepancy.WithNormalBalanceType(AmountType.Credit);
            var computedRetainedEarnings = retainedEarningsAccount.CurrentBalance + adjustedDiscrepancy;

            _logger.LogDebug("Computed Retained Earnings Balance: {computedRetainedEarnings:N2}", computedRetainedEarnings);

            var result = new BalanceSheetReportDto()
            {
                Tenant = tenant,
                DateRange = new DateRange(dateRangeStart, dateRangeEnd),

                Assets = assetAccounts,
                
                Liabilities = liabilityAccounts,
                
                Equity = equityAccounts.Select(a =>
                {
                    if (a.Account.Id == retainedEarningsAccount.Account.Id)
                    {
                        return new AccountWithBalanceDto()
                        {
                            Account = retainedEarningsAccount.Account,
                            CurrentBalance = computedRetainedEarnings,
                        };
                    }

                    return a;
                })
                    .ToArray(),

                NetIncome = netIncome,
                TotalAssets = totalAssets,
                TotalLiabilities = totalLiabilities,
                TotalEquity = totalEquity + netIncome + adjustedDiscrepancy,
                TotalLiabilitiesAndEquity = totalLiabilities + totalEquity + netIncome + adjustedDiscrepancy,
            };

            return new BusinessLogicResponse<BalanceSheetReportDto>(result);
        }

        public async Task<BusinessLogicResponse<ProfitAndLossReportDto>> GetProfitAndLossReport(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd)
        {
            _logger.LogDebug("Compiling data for Profit and Loss Report for date range from {dateRangeStart:d} to {dateRangeEnd:d}", dateRangeStart, dateRangeEnd);

            var tenant = await _tenantRepository.GetTenantAsync(tenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<ProfitAndLossReportDto>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Check that user has access to this tenant and permission for profit & loss data

            // Get the list of Revenue and Expense Accounts
            var profitAndLossAccounts = await _accountRepository.GetAccountsByTenantAsync(
                tenantId,
                new KnownAccountType[] { KnownAccountType.Revenue, KnownAccountType.Expenses });

            // Get Transactions for Revenue and Expense Accounts for the specified Date Range
            var revenueAndExpenseTransactions = await _journalEntryRepository.GetPostedJournalEntryAccountsAsync(
                tenantId,
                dateRangeStart,
                dateRangeEnd,
                KnownAccountType.Revenue,
                KnownAccountType.Expenses);

            // Group Transactions by Account and Sum the Amounts, and put it in a Dictionary for efficient lookup
            var revenueAndExpenseAccountAmountsLookup = revenueAndExpenseTransactions
                .GroupBy(tx => tx.AccountId)
                .ToDictionary(grp => grp.Key, grp => grp.Sum(tx => tx.Amount));

            // Transform the Accounts into `AccountWithBalanceDto` objects with `CurrentBalance` set
            // to the sum of the transactions for the period
            var profitAndLossAccountsWithBalances = profitAndLossAccounts.Select(a => new AccountWithBalanceDto()
            {
                Account = a,
                CurrentBalance = revenueAndExpenseAccountAmountsLookup.TryGetValue(a.Id, out var amount) ? amount : 0.0m,
            });

            // Categorize the Accounts to get the subtotals and totals
            var revenueAccounts = profitAndLossAccountsWithBalances.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Revenue);
            var expenseAccounts = profitAndLossAccountsWithBalances.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Expenses);
            var operatingRevenue = revenueAccounts.Where(a => a.Account.AccountSubTypeId == (int)KnownAccountSubType.OperatingRevenue);
            var otherIncome = revenueAccounts.Where(a => a.Account.AccountSubTypeId == (int)KnownAccountSubType.OtherIncome);
            var operatingExpenses = expenseAccounts.Where(a => a.Account.AccountSubTypeId != (int)KnownAccountSubType.OtherExpense);
            var otherExpenses = expenseAccounts.Where(a => a.Account.AccountSubTypeId == (int)KnownAccountSubType.OtherExpense);

            var grossProfit = operatingRevenue.Sum(a => a.CurrentBalance);
            var totalOperatingExpenses = operatingExpenses.Sum(a => a.CurrentBalance);
            var netOperatingIncome = grossProfit + totalOperatingExpenses;
            var totalOtherIncome = otherIncome.Sum(a => a.CurrentBalance);
            var totalOtherExpenses = otherExpenses.Sum(a => a.CurrentBalance);
            var netOtherIncome = totalOtherIncome + totalOtherExpenses;
            var netIncome = netOperatingIncome + netOtherIncome;

            var result = new ProfitAndLossReportDto()
            {
                Tenant = tenant,
                DateRange = new DateRange(dateRangeStart, dateRangeEnd),
                GrossProfit = grossProfit,
                TotalOperatingExpenses = totalOperatingExpenses,
                NetOperatingIncome = netOperatingIncome,
                TotalOtherIncome = totalOtherIncome,
                TotalOtherExpenses = totalOtherExpenses,
                NetOtherIncome = netOtherIncome,
                NetIncome = netIncome,
                OperatingIncome = operatingRevenue,
                OperatingExpenses = operatingExpenses,
                OtherIncome = otherIncome,
                OtherExpenses = otherExpenses,
            };

            return new BusinessLogicResponse<ProfitAndLossReportDto>(result);
        }

        private async Task<BusinessLogicResponse<IEnumerable<AccountWithBalanceDto>>> GetAccounts(
            Guid tenantId,
            DateTime dateForAccountBalances,
            params KnownAccountType[] accountTypes)
        {
            var specifiedAccountTypes = accountTypes.Any() ? accountTypes : null;

            var accounts = await _accountRepository.GetAccountsByTenantAsync(tenantId, specifiedAccountTypes);
            var accountBalances = await _accountRepository.GetAccountBalancesAsync(tenantId, dateForAccountBalances, specifiedAccountTypes);

            var results = accounts.Select(a => new AccountWithBalanceDto()
            {
                Account = a,
                CurrentBalance = accountBalances[a.Id],
            });

            return new BusinessLogicResponse<IEnumerable<AccountWithBalanceDto>>(results);
        }
    }
}
