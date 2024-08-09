using Microsoft.Extensions.Caching.Distributed;

namespace DashAccountingSystemV2.BackEnd.Services.Caching
{
    public interface IExtendedDistributedCache : IDistributedCache
    {
        Task<TCachedData?> GetObjectAsync<TCachedData>(string key);

        Task SetAsync(
            string key,
            byte[] value,
            TimeSpan expiration,
            bool isSlidingExpiration = false);

        Task SetObjectAsync<TCachedData>(
            string key,
            TCachedData value);

        Task SetObjectAsync<TCachedData>(
            string key,
            TCachedData value,
            TimeSpan expiration,
            bool isSlidingExpiration = false);

        Task SetObjectAsync<TCachedData>(
            string key,
            TCachedData value,
            DistributedCacheEntryOptions options,
            CancellationToken cancellationToken = default);
    }
}
