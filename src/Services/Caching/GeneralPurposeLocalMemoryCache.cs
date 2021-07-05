using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using DashAccountingSystemV2.Configuration;

namespace DashAccountingSystemV2.Services.Caching
{
    public class GeneralPurposeLocalMemoryCache : IExtendedDistributedCache
    {
        private const int DEFAULT_CACHE_TTL_IN_SECONDS = 600; // 10 minutes

        private readonly MemoryDistributedCache _cache = null;
        private readonly ILogger _logger = null;

        public GeneralPurposeLocalMemoryCache(ILogger<GeneralPurposeLocalMemoryCache> logger)
        {
            _cache = new MemoryDistributedCache(OptionsHelper.Make<MemoryDistributedCacheOptions>());
            _logger = logger;
        }

        public byte[] Get(string key)
        {
            try
            {
                var bytes = _cache.Get(key);
                return bytes;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed retrieving data from cache (raw bytes)");
                return null;
            }
        }

        public Task<byte[]> GetAsync(string key, CancellationToken token = default)
        {
            try
            {
                return _cache.GetAsync(key, token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed retrieving data from cache for key \'{0}\' (raw bytes / async)",
                    key);
                return Task.FromResult<byte[]>(null);
            }
        }

        public async Task<TCachedData> GetObjectAsync<TCachedData>(string key)
        {
            try
            {
                var bytes = await _cache.GetAsync(key);

                if (bytes == null || bytes.Length == 0)
                {
                    _logger.LogWarning("Null or empty byte array retrieved from cache for key \'{0}\'", key);
                    return default(TCachedData);
                }

                return Deserialize<TCachedData>(bytes);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed retrieving data from cache for key \'{0}\'", key);
            }

            return default(TCachedData);
        }

        public void Refresh(string key)
        {
            try
            {
                _cache.Refresh(key);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed refreshing data in cache for key \'{0}\'", key);
            }
        }

        public Task RefreshAsync(string key, CancellationToken token = default)
        {
            try
            {
                return _cache.RefreshAsync(key, token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed refreshing data in cache for key \'{0}\' (async)", key);
                return Task.CompletedTask;
            }
        }

        public void Remove(string key)
        {
            try
            {
                _cache.Remove(key);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed evicting data from cache for key \'{0}\'", key);
            }
        }

        public Task RemoveAsync(string key, CancellationToken token = default)
        {
            try
            {
                return _cache.RemoveAsync(key, token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Failed evicting data from cache for key \'{0}\'", key);
                return Task.CompletedTask;
            }
        }

        public void Set(string key, byte[] value, DistributedCacheEntryOptions options)
        {
            try
            {
                _cache.Set(key, value, options);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed setting data in cache for key \'{0}\'", key);
            }
        }

        public Task SetAsync(
            string key,
            byte[] value,
            TimeSpan expiration,
            bool isSlidingExpiration = false)
        {
            var options = GetCacheEntryOptions(expiration, isSlidingExpiration);
            return SetAsync(key, value, options);
        }

        public Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token = default)
        {
            try
            {
                return _cache.SetAsync(key, value, options, token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed setting data in in cache for key \'{0}\'", key);
                return Task.CompletedTask;
            }
        }

        public Task SetObjectAsync<TCachedData>(string key, TCachedData value)
        {
            var options = GetCacheEntryOptions(DEFAULT_CACHE_TTL_IN_SECONDS);
            return SetObjectAsync(key, value, options);
        }

        public Task SetObjectAsync<TCachedData>(
            string key,
            TCachedData value,
            TimeSpan expiration,
            bool isSlidingExpiration = false)
        {
            var options = GetCacheEntryOptions(expiration, isSlidingExpiration);
            return SetObjectAsync(key, value, options);
        }

        public Task SetObjectAsync<TCachedData>(
            string key,
            TCachedData value,
            DistributedCacheEntryOptions options,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var bytes = Serialize(value);
                return _cache.SetAsync(key, bytes, options, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed setting data in in cache for key \'{0}\'", key);
                return Task.CompletedTask;
            }
        }

        #region Cache Entry Options Helpers
        private DistributedCacheEntryOptions GetCacheEntryOptions(int absoluteExpirationInSeconds)
        {
            return GetCacheEntryOptions(TimeSpan.FromSeconds(absoluteExpirationInSeconds), false);
        }

        private DistributedCacheEntryOptions GetCacheEntryOptions(TimeSpan expiration, bool isSlidingExpiration)
        {
            var options = new DistributedCacheEntryOptions();

            if (isSlidingExpiration)
            {
                options.SlidingExpiration = expiration;
            }
            else
            {
                options.AbsoluteExpirationRelativeToNow = expiration;
            }

            return options;
        }
        #endregion Cache Entry Options Helpers

        #region Serialization Helpers
        private byte[] Serialize(object value)
        {
            if (value == null) return new byte[0];

            var json = JsonConvert.SerializeObject(value);
            var bytes = Encoding.UTF8.GetBytes(json);

            return bytes;
        }

        private TCachedData Deserialize<TCachedData>(byte[] serializedBytes)
        {
            if (serializedBytes == null || serializedBytes.Length == 0)
            {
                return default(TCachedData);
            }

            var json = Encoding.UTF8.GetString(serializedBytes);
            var obj = JsonConvert.DeserializeObject<TCachedData>(json);

            return obj;
        }
        #endregion Serialization Helpers
    }
}
