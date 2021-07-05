using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Xunit;
using DashAccountingSystemV2.Caching;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Tests.Caching
{
    public class GeneralPurposeLocalMemoryCacheFixture
    {
        [Fact]
        public async Task Get_And_Set_Bytes_Ok()
        {
            var loggerFactory = TestUtilities.GetLoggerFactory();
            var memoryCache = new GeneralPurposeLocalMemoryCache(
                loggerFactory.CreateLogger<GeneralPurposeLocalMemoryCache>());

            var guid1 = Guid.NewGuid();
            var guid2 = Guid.NewGuid();
            var guid3 = Guid.NewGuid();
            var guid4 = Guid.NewGuid();

            var sizeOfFourGuids = 16 * 4;
            var bytesToCache = new byte[sizeOfFourGuids];
            Buffer.BlockCopy(guid1.ToByteArray(), 0, bytesToCache, 0, 16);
            Buffer.BlockCopy(guid2.ToByteArray(), 0, bytesToCache, 16, 16);
            Buffer.BlockCopy(guid3.ToByteArray(), 0, bytesToCache, 32, 16);
            Buffer.BlockCopy(guid4.ToByteArray(), 0, bytesToCache, 48, 16);

            var cacheKey = "foo-cache-key";
            var cacheOptions = new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1),
            };

            var cancellationTokenSource = new CancellationTokenSource();
            await memoryCache.SetAsync(cacheKey, bytesToCache, cacheOptions, cancellationTokenSource.Token);

            var recoveredBytes = await memoryCache.GetAsync(cacheKey);
            Assert.NotNull(recoveredBytes);
            Assert.NotEmpty(recoveredBytes);
            Assert.Equal(sizeOfFourGuids, recoveredBytes.Length);

            var recoveredGuid1Bytes = new byte[16];
            Buffer.BlockCopy(recoveredBytes, 0, recoveredGuid1Bytes, 0, 16);
            var recoveredGuid1 = new Guid(recoveredGuid1Bytes);
            Assert.Equal(guid1, recoveredGuid1);

            var recoveredGuid2Bytes = new byte[16];
            Buffer.BlockCopy(recoveredBytes, 16, recoveredGuid2Bytes, 0, 16);
            var recoveredGuid2 = new Guid(recoveredGuid2Bytes);
            Assert.Equal(guid2, recoveredGuid2);

            var recoveredGuid3Bytes = new byte[16];
            Buffer.BlockCopy(recoveredBytes, 32, recoveredGuid3Bytes, 0, 16);
            var recoveredGuid3 = new Guid(recoveredGuid3Bytes);
            Assert.Equal(guid3, recoveredGuid3);

            var recoveredGuid4Bytes = new byte[16];
            Buffer.BlockCopy(recoveredBytes, 48, recoveredGuid4Bytes, 0, 16);
            var recoveredGuid4 = new Guid(recoveredGuid4Bytes);
            Assert.Equal(guid4, recoveredGuid4);
        }

        [Fact]
        public async Task Get_And_Set_StructuredData_Ok()
        {
            var loggerFactory = TestUtilities.GetLoggerFactory();
            var memoryCache = new GeneralPurposeLocalMemoryCache(
                loggerFactory.CreateLogger<GeneralPurposeLocalMemoryCache>());

            var fakeTenantId = Guid.NewGuid();
            var fakeUserId = Guid.NewGuid();
            var account = new Account(
                fakeTenantId,
                1010,
                "Operating Cash Account",
                "Primary business checking account.",
                1,
                1,
                1,
                AmountType.Debit,
                fakeUserId);

            var cacheKey = "bar-cache-key";

            await memoryCache.SetObjectAsync(cacheKey, account);

            var recoveredAccount = await memoryCache.GetObjectAsync<Account>(cacheKey);
            Assert.NotNull(recoveredAccount);
            Assert.Equal(account.AccountNumber, recoveredAccount.AccountNumber);
            Assert.Equal(account.Name, recoveredAccount.Name);
        }
    }
}
