using Microsoft.Extensions.Caching.Distributed;
using DashAccountingSystemV2.BackEnd.Services.Caching;

namespace DashAccountingSystemV2.Tests.Fakes
{
    public class FakeCache : IExtendedDistributedCache
    {
        private static readonly long DEFAULT_TTL_SECONDS = 180;
        private Dictionary<string, Tuple<object, long>> _internalCacheStore = new Dictionary<string, Tuple<object, long>>();

        public byte[] Get(string key)
        {
            if (_internalCacheStore.ContainsKey(key))
            {
                return (byte[])_internalCacheStore[key].Item1;
            }

            return null;
        }

        public Task<byte[]?> GetAsync(string key, CancellationToken token = default)
        {
            if (_internalCacheStore.ContainsKey(key))
            {
                return Task.FromResult((byte[]?)_internalCacheStore[key].Item1);
            }

            return Task.FromResult<byte[]?>(null);
        }

        public Task<TCachedData?> GetObjectAsync<TCachedData>(string key)
        {
            if (_internalCacheStore.ContainsKey(key))
            {
                return Task.FromResult((TCachedData?)_internalCacheStore[key].Item1);
            }

            return Task.FromResult(default(TCachedData?));
        }

        public void Refresh(string key)
        {
            return;
        }

        public Task RefreshAsync(string key, CancellationToken token = default)
        {
            return Task.CompletedTask;
        }

        public void Remove(string key)
        {
            if (_internalCacheStore.ContainsKey(key))
            {
                _internalCacheStore.Remove(key);
            }
        }

        public Task RemoveAsync(string key, CancellationToken token = default)
        {
            if (_internalCacheStore.ContainsKey(key))
            {
                _internalCacheStore.Remove(key);
            }

            return Task.CompletedTask;
        }

        public void Set(string key, byte[] value, DistributedCacheEntryOptions options)
        {
            _internalCacheStore[key] = new Tuple<object, long>(value, GetCacheTTL(options));
        }

        public Task SetAsync(string key, byte[] value, TimeSpan expiration, bool isSlidingExpiration = false)
        {
            _internalCacheStore[key] = new Tuple<object, long>(value, (long)expiration.TotalSeconds);
            return Task.CompletedTask;
        }

        public Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token = default)
        {
            Set(key, value, options);
            return Task.CompletedTask;
        }

        public Task SetObjectAsync<TCachedData>(string key, TCachedData value)
        {
            _internalCacheStore[key] = new Tuple<object, long>(value, DEFAULT_TTL_SECONDS);
            return Task.CompletedTask;
        }

        public Task SetObjectAsync<TCachedData>(string key, TCachedData value, TimeSpan expiration, bool isSlidingExpiration = false)
        {
            _internalCacheStore[key] = new Tuple<object, long>(value, (long)expiration.TotalSeconds);
            return Task.CompletedTask;
        }

        public Task SetObjectAsync<TCachedData>(string key, TCachedData value, DistributedCacheEntryOptions options, CancellationToken cancellationToken = default)
        {
            _internalCacheStore[key] = new Tuple<object, long>(value, GetCacheTTL(options));
            return Task.CompletedTask;
        }

        private long GetCacheTTL(DistributedCacheEntryOptions options)
        {
            if (options == null)
                return DEFAULT_TTL_SECONDS;

            if (options.AbsoluteExpiration.HasValue)
                return (long)(options.AbsoluteExpiration.Value - DateTime.UtcNow).TotalSeconds;

            if (options.AbsoluteExpirationRelativeToNow.HasValue)
                return (long)options.AbsoluteExpirationRelativeToNow.Value.TotalSeconds;

            if (options.SlidingExpiration.HasValue)
                return (long)(options.SlidingExpiration.Value.TotalSeconds);

            return DEFAULT_TTL_SECONDS;
        }
    }
}
