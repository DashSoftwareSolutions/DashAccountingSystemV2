using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class AccountingReportBusinessLogic : IAccountingReportBusinessLogic
    {
        private readonly IAccountRepository _accountRepository = null;
        private readonly IJournalEntryRepository _journalEntryRepository = null;
        private readonly ITenantRepository _tenantRepository = null;
        private readonly ILogger _logger = null;

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

            var balanaceSheetAccounts = balanceSheetAccountsResponse.Data;

            // TODO/FIXME: Need to refactor to get this from the Tenant
            var assetType = balanaceSheetAccounts.Select(a => a.Account.AssetType).First();

            var assetAccounts = balanaceSheetAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Assets);
            var liabilityAccounts = balanaceSheetAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Liabilities);
            var equityAccounts = balanaceSheetAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.OwnersEquity);

            var totalAssets = assetAccounts.Sum(a => a.CurrentBalance);
            var totalLiabilities = liabilityAccounts.Sum(a => a.CurrentBalance);
            var totalEquity = equityAccounts.Sum(a => a.CurrentBalance);

            _logger.LogDebug("Total Assets: {0:N2}", totalAssets);
            _logger.LogDebug("Total Liabilities: {0:N2}", totalLiabilities);
            _logger.LogDebug("Total Equity: {0:N2}", totalEquity);

            var combinedLiabilityAndEquity = totalLiabilities + totalEquity;

            _logger.LogDebug("Liabilities + Equity: {0:N2}", combinedLiabilityAndEquity);

            _logger.LogDebug("Fetching revenue and expense transactions for the period...");
            var revenueAndExpenseTransactions = await _journalEntryRepository.GetPostedJournalEntryAccountsAsync(
                tenantId,
                dateRangeStart,
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
            var discrepency = totalAssets + combinedLiabilityAndEquity + netIncome;

            _logger.LogDebug("Discrepency with Assets: {0:N2}", discrepency);

            var retainedEarningsAccount = balanaceSheetAccounts.FirstOrDefault(a => a.Account.AccountSubTypeId == (int)KnownAccountSubType.RetainedEarnings);
            var hasRetainedEarningsAccount = retainedEarningsAccount != null;

            if (!hasRetainedEarningsAccount)
            {
                _logger.LogWarning("Oh noes!  No Retained Earnings Account!");

                return new BusinessLogicResponse<BalanceSheetReportDto>(
                    new BalanceSheetReportDto()
                    {
                        Tenant = tenant,
                        DateRange = new DateRange(dateRangeStart, dateRangeEnd),
                        AssetType = assetType,
                        Assets = assetAccounts,
                        Liabilities = liabilityAccounts,
                        Equity = equityAccounts,
                        NetIncome = netIncome,
                        TotalAssets = totalAssets,
                        TotalLiabilities = totalLiabilities,
                        TotalEquity = totalEquity,
                        TotalLiabilitiesAndEquity = totalLiabilities + totalEquity + netIncome,
                        Discrepency = discrepency,
                    });
            }

            // The discrepency then needs to be added to Retained Earnings
            // Invert the sign, as the amount should be relative to Credit
            // * If we have a positive discrepency (i.e. Debit / more Assets), we need to _increase_ the Retained Earnings amount by adding an additional negative (Credit) amount
            // * If we have a negative discrepency (i.e. Credit / more Liabilities and Equities), we need to _decrease_ the Retained Earnings amount by adding an additional positive (Debit) amount
            // TODO: After checking again, I noticed QuickBooks seems to consider Retained Earnings to be updated yearly.  Need to see if I can mimic that.
            var adjustedDiscrepency = discrepency.WithNormalBalanceType(AmountType.Credit);
            var computedRetainedEarnings = retainedEarningsAccount.CurrentBalance + adjustedDiscrepency;

            _logger.LogDebug("Computed Retained Earnings Balance: {0:N2}", computedRetainedEarnings);

            var result = new BalanceSheetReportDto()
            {
                Tenant = tenant,
                DateRange = new DateRange(dateRangeStart, dateRangeEnd),
                AssetType = assetType,

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
                TotalEquity = totalEquity + netIncome + adjustedDiscrepency,
                TotalLiabilitiesAndEquity = totalLiabilities + totalEquity + netIncome + adjustedDiscrepency,
            };

            return new BusinessLogicResponse<BalanceSheetReportDto>(result);
        }

        public async Task<BusinessLogicResponse<ProfitAndLossReportDto>> GetProfitAndLossReport(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd)
        {
            _logger.LogDebug("Compiling data for Profit and Loss Report for date range from {0:d} to {1:d}", dateRangeStart, dateRangeEnd);
            _logger.LogDebug("Getting final balances for all Revenue and Expense accounts...");

            var tenant = await _tenantRepository.GetTenantAsync(tenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<ProfitAndLossReportDto>(ErrorType.RequestedEntityNotFound, "Tenant not found");
            }

            // TODO: Check that user has access to this tenant and permission for profit & loss data

            var profitAndLossAccountsReponse = await GetAccounts(
                tenantId,
                dateRangeEnd,
                KnownAccountType.Revenue,
                KnownAccountType.Expenses);

            if (!profitAndLossAccountsReponse.IsSuccessful)
                return new BusinessLogicResponse<ProfitAndLossReportDto>(profitAndLossAccountsReponse);

            var profitAndLossAccounts = profitAndLossAccountsReponse.Data;

            // TODO/FIXME: Need to refactor so we don't have to worry about Asset Type!
            var assetType = profitAndLossAccounts.Select(a => a.Account.AssetType).First();

            var revenueAccounts = profitAndLossAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Revenue);
            var expenseAccounts = profitAndLossAccounts.Where(a => a.Account.AccountTypeId == (int)KnownAccountType.Expenses);
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
                AssetType = assetType,
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
