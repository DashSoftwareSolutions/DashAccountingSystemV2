﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class AccountingReportBusinessLogic : IAccountingReportBusinessLogic
    {
        private readonly IAccountRepository _accountRepository = null;
        private readonly IJournalEntryRepository _journalEntryRepository = null;
        private readonly ILogger _logger = null;

        public AccountingReportBusinessLogic(
            IAccountRepository accountRepository,
            IJournalEntryRepository journalEntryRepository,
            ILogger<AccountingReportBusinessLogic> logger)
        {
            _accountRepository = accountRepository;
            _journalEntryRepository = journalEntryRepository;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<BalanceSheetReportDto>> GetBalanceSheetReport(Guid tenantId, DateTime dateRangeStart, DateTime dateRangeEnd)
        {
            _logger.LogDebug("Compiling data for Balance Sheet Report for date range from {0:d} to {1:d}", dateRangeStart, dateRangeEnd);
            _logger.LogDebug("Getting final balances for all Assets, Liabilities and Equities accounts...");

            var balanceSheetAccountsResponse = await GetAccounts(
                tenantId,
                dateRangeEnd,
                KnownAccountType.Assets,
                KnownAccountType.Liabilities,
                KnownAccountType.OwnersEquity);

            if (!balanceSheetAccountsResponse.IsSuccessful)
                return new BusinessLogicResponse<BalanceSheetReportDto>(balanceSheetAccountsResponse);

            var balanaceSheetAccounts = balanceSheetAccountsResponse.Data;

            // TODO/FIXME: Need to refactor so we don't have to worry about Asset Type!
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
            var adjustedDiscrepency = discrepency * -1;
            var computedRetainedEarnings = retainedEarningsAccount.CurrentBalance + adjustedDiscrepency;

            _logger.LogDebug("Computed Retained Earnings Balance: {0:N2}", computedRetainedEarnings);

            var result = new BalanceSheetReportDto()
            {
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
                TotalEquity = totalEquity + adjustedDiscrepency,
                TotalLiabilitiesAndEquity = totalLiabilities + totalEquity + adjustedDiscrepency + netIncome,
            };

            return new BusinessLogicResponse<BalanceSheetReportDto>(result);
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
