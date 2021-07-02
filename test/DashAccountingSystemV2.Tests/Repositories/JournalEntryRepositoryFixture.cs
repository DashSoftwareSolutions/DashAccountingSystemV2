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
        public void GetJournalEntryAccounts_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // ARRANGE
                var accountRepository = await GetAccountRepository();
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

                var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
                var accountSubTypeBankAccount = accountSubTypes.Single(ast => ast.Name == "Bank Account");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, accountSubTypeBankAccount, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");
                var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

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

                var savedJournalEntry = await journalEntryRepository.CreateJournalEntryAsync(journalEntry);

                // ACT
                var journalEntryAccounts = await journalEntryRepository.GetJournalEntryAccountsAsync(
                    _tenantId,
                    entryDate,
                    postDate);

                // ASSERT
                Assert.NotEmpty(journalEntryAccounts);
            });
        }

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

                var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
                var accountSubTypeBankAccount = accountSubTypes.Single(ast => ast.Name == "Bank Account");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, accountSubTypeBankAccount, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");
                var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

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

                var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
                var accountSubTypeBankAccount = accountSubTypes.Single(ast => ast.Name == "Bank Account");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, accountSubTypeBankAccount, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");
                var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

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

                var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
                var accountSubTypeBankAccount = accountSubTypes.Single(ast => ast.Name == "Bank Account");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, accountSubTypeBankAccount, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");
                var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

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

        [Fact]
        [Trait("Category", "Requires Database")]
        public void UpdateCompleteJournalEntryAsync_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // ARRANGE
                //     SET UP ACCOUNTS
                var accountRepository = await GetAccountRepository();
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

                var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
                var accountSubTypeBankAccount = accountSubTypes.Single(ast => ast.Name == "Bank Account");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, accountSubTypeBankAccount, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");
                var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

                var revenueAccount1 = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

                var revenueAccount2 = await MakeAccount(
                    4020, "Revenue from Sale of Foo Widgets", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

                var revenueAccount3 = await MakeAccount(
                    4030, "Revenue from Sale of Bar Widgets", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

                //    MAKE INITIAL PENDING JOURNAL ENTRY
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
                    revenueAccount1.Id, -transactionAmount, assetTypeUSD.Id));

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
                    jeAcct.AccountId == revenueAccount1.Id &&
                    jeAcct.Account.AccountNumber == revenueAccount1.AccountNumber &&
                    jeAcct.Account.Name == revenueAccount1.Name &&
                    jeAcct.Amount == -transactionAmount);

                Assert.Equal(0, savedJournalEntry.Accounts.Sum(jeAcct => jeAcct.Amount));

                Assert.True(savedJournalEntry.IsBalanced);
                Assert.Equal(TransactionStatus.Pending, savedJournalEntry.Status);

                // ACT - UPDATE THE ENTRY
                var entryWithUpdates = savedJournalEntry.Clone();
                entryWithUpdates.EntryDate = savedJournalEntry.EntryDate.AddDays(3);
                entryWithUpdates.Description += ".  Updated description.";
                entryWithUpdates.Note = "Modified from services rendered to sale of Foo and Bar Widgets";
                entryWithUpdates.Accounts.Single(a => a.AccountId == cashAccount.Id).Amount = 11000.00m;
                entryWithUpdates.Accounts.Remove(entryWithUpdates.Accounts.Single(a => a.AccountId == revenueAccount1.Id));
                entryWithUpdates.Accounts.Add(new JournalEntryAccount(
                    revenueAccount2.Id, -9000.00m, assetTypeUSD.Id));
                entryWithUpdates.Accounts.Add(new JournalEntryAccount(
                    revenueAccount3.Id, -2000.00m, assetTypeUSD.Id));

                var savedUpdatedEntry = await journalEntryRepository.UpdateCompleteJournalEntryAsync(entryWithUpdates, _userId);

                // ASSERT
                Assert.NotNull(savedUpdatedEntry);
                // TODO: More robust assertions
            });
        }

        [Fact]
        [Trait("Category", "Requires Database")]
        public void DeletePendingByTenantAndEntryIdAsync_Ok()
        {
            TestUtilities.RunTestAsync(Initialize, Cleanup, async () =>
            {
                // ARRANGE
                var accountRepository = await GetAccountRepository();
                var sharedLookupRepository = await GetSharedLookupRepository();

                var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
                var accountTypeAsset = accountTypes.Single(at => at.Name == "Asset");

                var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
                var accountSubTypeBankAccount = accountSubTypes.Single(ast => ast.Name == "Bank Account");

                var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
                var assetTypeUSD = assetTypes.Single(at => at.Name == "USD");

                var cashAccount = await MakeAccount(
                    1010, "Operating Cash Account", accountTypeAsset, accountSubTypeBankAccount, assetTypeUSD, AmountType.Debit);

                var accountTypeRevenue = accountTypes.Single(at => at.Name == "Revenue");
                var accountSubTypeOperatingRevenue = accountSubTypes.Single(ast => ast.Name == "Operating Revenue");

                var revenueAccount = await MakeAccount(
                    4010, "Payments for Services Rendered", accountTypeRevenue, accountSubTypeOperatingRevenue, assetTypeUSD, AmountType.Credit);

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

                // VERIFY WE CAN FETCH IT
                var retreivedJournalEntry = await journalEntryRepository.GetByIdAsync(savedJournalEntry.Id);
                Assert.NotNull(retreivedJournalEntry);

                var savedJournalEntry_EntryId = savedJournalEntry.EntryId;

                retreivedJournalEntry = await journalEntryRepository.GetByTenantAndEntryIdAsync(_tenantId, savedJournalEntry_EntryId);
                Assert.NotNull(retreivedJournalEntry);

                // ACT - Delete it
                await journalEntryRepository.DeletePendingByTenantAndEntryIdAsync(_tenantId, savedJournalEntry_EntryId);

                // ASSERT - Should not be able to fetch it now
                retreivedJournalEntry = await journalEntryRepository.GetByIdAsync(savedJournalEntry.Id);
                Assert.Null(retreivedJournalEntry);

                retreivedJournalEntry = await journalEntryRepository.GetByTenantAndEntryIdAsync(_tenantId, savedJournalEntry_EntryId);
                Assert.Null(retreivedJournalEntry);
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
            AccountSubType accountSubType,
            AssetType assetType,
            AmountType balanceType)
        {
            var account = new Account(
                _tenantId,
                accountNumber,
                name,
                null,
                accountType.Id,
                accountSubType.Id,
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
