using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;

namespace DashAccountingSystemV2.Caching
{
    public interface IExtendedDistributedCache : IDistributedCache
    {
        Task<TCachedData> GetObjectAsync<TCachedData>(string key);

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
