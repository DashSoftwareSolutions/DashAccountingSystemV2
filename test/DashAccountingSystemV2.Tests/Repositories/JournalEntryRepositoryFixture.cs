using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Npgsql;
using Xunit;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.Repositories;

namespace DashAccountingSystemV2.Tests.Repositories
{
    public class JournalEntryRepositoryFixture
    {
        private Guid _tenantId;
        private Guid _userId;

        [Fact]
        [Trait("Category", "Requires Database")]
        public void InsertJournalEntry_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // ARRANGE
                var accountRepository = await GetAccountRepository();
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD $");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, assetTypeUSD, AmountType.Credit);

                var entryDate = new DateTime(2018, 12, 11, 0, 0, 0, DateTimeKind.Utc);

                var journalEntry = new JournalEntry(
                    _tenantId,
                    entryDate,
                    null,
                    "Payment for Invoice #1001",
                    null,
                    _userId,
                    null);

                var transactionAmount = 10000.00m;

                journalEntry.Accounts.Add(new JournalEntryAccount(
                    cashAccount.Id, transactionAmount, assetTypeUSD.Id));
                journalEntry.Accounts.Add(new JournalEntryAccount(
                    revenueAccount.Id, -transactionAmount, assetTypeUSD.Id));

                var journalEntryRepository = await GetJournalEntryRepository();

                // ACT - INSERT THE JOURNAL ENTRY
                var savedJournalEntry = await journalEntryRepository.CreateJournalEntryAsync(journalEntry);

                // ASSERT all the things!
                Assert.NotNull(savedJournalEntry);
                Assert.True(savedJournalEntry.Id != Guid.Empty);
                Assert.True(savedJournalEntry.EntryId > 0);

                Assert.Equal(2, savedJournalEntry.Accounts.Count());
                Assert.All(savedJournalEntry.Accounts, jeAcct => Assert.NotNull(jeAcct?.Account));

                Assert.Contains(savedJournalEntry.Accounts, jeAcct =>
                        jeAcct.AccountId == cashAccount.Id &&
                        jeAcct.Account.AccountNumber == cashAccount.AccountNumber &&
                        jeAcct.Account.Name == cashAccount.Name &&
                        jeAcct.Amount == transactionAmount);

                Assert.Contains(savedJournalEntry.Accounts, jeAcct =>
                    jeAcct.AccountId == revenueAccount.Id &&
                    jeAcct.Account.AccountNumber == revenueAccount.AccountNumber &&
                    jeAcct.Account.Name == revenueAccount.Name &&
                    jeAcct.Amount == -transactionAmount);

                Assert.Equal(0, savedJournalEntry.Accounts.Sum(jeAcct => jeAcct.Amount));

                Assert.True(savedJournalEntry.IsBalanced);
                Assert.Equal(TransactionStatus.Pending, savedJournalEntry.Status);
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void InsertPostedJournalEntry_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // ARRANGE - SET UP A JOURNAL ENTRY THAT INCLUDES A POST DATE
                var accountRepository = await GetAccountRepository();
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD $");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, assetTypeUSD, AmountType.Credit);

                var entryDate = new DateTime(2018, 12, 11, 0, 0, 0, DateTimeKind.Utc);
                var postDate = entryDate.AddDays(3);

                var journalEntry = new JournalEntry(
                    _tenantId,
                    entryDate,
                    postDate,
                    "Payment for Invoice #1001",
                    null,
                    _userId,
                    null);

                var transactionAmount = 10000.00m;

                journalEntry.Accounts.Add(new JournalEntryAccount(
                    cashAccount.Id, transactionAmount, assetTypeUSD.Id));
                journalEntry.Accounts.Add(new JournalEntryAccount(
                    revenueAccount.Id, -transactionAmount, assetTypeUSD.Id));

                var journalEntryRepository = await GetJournalEntryRepository();

                // ACT - INSERT THE JOURNAL ENTRY
                var savedJournalEntry = await journalEntryRepository.CreateJournalEntryAsync(journalEntry);

                // ASSERT all the things!
                Assert.NotNull(savedJournalEntry);
                Assert.True(savedJournalEntry.Id != Guid.Empty);
                Assert.True(savedJournalEntry.EntryId > 0);

                Assert.Equal(2, savedJournalEntry.Accounts.Count());
                Assert.All(savedJournalEntry.Accounts, jeAcct => Assert.NotNull(jeAcct?.Account));

                Assert.Contains(savedJournalEntry.Accounts, jeAcct =>
                        jeAcct.AccountId == cashAccount.Id &&
                        jeAcct.Account.AccountNumber == cashAccount.AccountNumber &&
                        jeAcct.Account.Name == cashAccount.Name &&
                        jeAcct.Amount == transactionAmount);

                Assert.Contains(savedJournalEntry.Accounts, jeAcct =>
                    jeAcct.AccountId == revenueAccount.Id &&
                    jeAcct.Account.AccountNumber == revenueAccount.AccountNumber &&
                    jeAcct.Account.Name == revenueAccount.Name &&
                    jeAcct.Amount == -transactionAmount);

                Assert.Equal(0, savedJournalEntry.Accounts.Sum(jeAcct => jeAcct.Amount));

                Assert.True(savedJournalEntry.IsBalanced);
                Assert.Equal(TransactionStatus.Posted, savedJournalEntry.Status);
                Assert.Equal(postDate, savedJournalEntry.PostDate);
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void PostJournalEntry_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // ARRANGE - SET UP A PENDING JOURNAL ENTRY
                var accountRepository = await GetAccountRepository();
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD $");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, assetTypeUSD, AmountType.Credit);

                var entryDate = new DateTime(2018, 12, 11, 0, 0, 0, DateTimeKind.Utc);

                var journalEntry = new JournalEntry(
                    _tenantId,
                    entryDate,
                    null,
                    "Payment for Invoice #1001",
                    null,
                    _userId,
                    null);

                var transactionAmount = 10000.00m;

                journalEntry.Accounts.Add(new JournalEntryAccount(
                    cashAccount.Id, transactionAmount, assetTypeUSD.Id));
                journalEntry.Accounts.Add(new JournalEntryAccount(
                    revenueAccount.Id, -transactionAmount, assetTypeUSD.Id));

                var journalEntryRepository = await GetJournalEntryRepository();

                var savedJournalEntry = await journalEntryRepository.CreateJournalEntryAsync(journalEntry);

                Assert.NotNull(savedJournalEntry);
                Assert.True(savedJournalEntry.Id != Guid.Empty);
                Assert.True(savedJournalEntry.EntryId > 0);

                Assert.Equal(2, savedJournalEntry.Accounts.Count());
                Assert.All(savedJournalEntry.Accounts, jeAcct => Assert.NotNull(jeAcct?.Account));

                Assert.Contains(savedJournalEntry.Accounts, jeAcct =>
                        jeAcct.AccountId == cashAccount.Id &&
                        jeAcct.Account.AccountNumber == cashAccount.AccountNumber &&
                        jeAcct.Account.Name == cashAccount.Name &&
                        jeAcct.Amount == transactionAmount);

                Assert.Contains(savedJournalEntry.Accounts, jeAcct =>
                    jeAcct.AccountId == revenueAccount.Id &&
                    jeAcct.Account.AccountNumber == revenueAccount.AccountNumber &&
                    jeAcct.Account.Name == revenueAccount.Name &&
                    jeAcct.Amount == -transactionAmount);

                Assert.Equal(0, savedJournalEntry.Accounts.Sum(jeAcct => jeAcct.Amount));

                Assert.True(savedJournalEntry.IsBalanced);
                Assert.Equal(TransactionStatus.Pending, savedJournalEntry.Status);
                
                // ACT - POST THE ENTRY
                var postDate = entryDate.AddDays(2);
                var postedJournalEntry = await journalEntryRepository.PostJournalEntryAsync(
                    savedJournalEntry.Id,
                    postDate,
                    _userId);

                // ASSERT All the Things!
                Assert.NotNull(postedJournalEntry);
                Assert.NotNull(postedJournalEntry.PostDate);
                Assert.Equal(postDate, postedJournalEntry.PostDate);
                Assert.Equal(TransactionStatus.Posted, postedJournalEntry.Status);
            });
        }

        private async Task<IAccountRepository> GetAccountRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new AccountRepository(appDbContext);
        }

        private async Task<IJournalEntryRepository> GetJournalEntryRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new JournalEntryRepository(appDbContext);
        }

        private async Task<ISharedLookupRepository> GetSharedLookupRepository()
        {
            var appDbContext = await TestUtilities.GetDatabaseContextAsync();
            return new SharedLookupRepository(appDbContext);
        }

        private async Task<Account> MakeAccount(
            ushort accountNumber,
            string name,
            AccountType accountType,
            AssetType assetType,
            AmountType balanceType)
        {
            var account = new Account(
                _tenantId,
                accountNumber,
                name,
                null,
                accountType.Id,
                assetType.Id,
                balanceType,
                _userId);

            var accountRepository = await GetAccountRepository();
            var savedAccount = await accountRepository.CreateAccountAsync(account);

            Assert.NotNull(savedAccount);
            Assert.True(savedAccount.Id != Guid.Empty);

            return savedAccount;
        }

        private void Initialize()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                // Make a Tenant
                _tenantId = connection.QueryFirstOrDefault<Guid>($@"
                    INSERT INTO ""Tenant"" ( ""Name"" )
                    VALUES ( 'Unit Testing {Guid.NewGuid()}, Inc.' )
                    RETURNING ""Id"";");

                // Get a User to use
                _userId = connection.QueryFirstOrDefault<Guid>(@"
                    SELECT ""Id"" FROM ""AspNetUsers"" ORDER BY ""LastName"", ""FirstName"" LIMIT 1;");
            }
        }

        private void Cleanup()
        {
            var connString = TestUtilities.GetConnectionString();

            using (var connection = new NpgsqlConnection(connString))
            {
                var parameters = new { _tenantId };

                connection.Execute(@"
                    DELETE FROM ""JournalEntryAccount"" WHERE ""JournalEntryId"" IN ( SELECT ""Id"" FROM ""JournalEntry"" WHERE ""TenantId"" = @_tenantId );",
                    parameters);

                connection.Execute(@"
                    DELETE FROM ""JournalEntry"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                connection.Execute(@"
                    DELETE FROM ""Account"" WHERE ""TenantId"" = @_tenantId;",
                    parameters);

                connection.Execute(@"
                    DELETE FROM ""Tenant"" WHERE ""Id"" = @_tenantId;",
                    parameters);
            }
        }
    }
}
