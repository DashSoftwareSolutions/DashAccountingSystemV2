using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using DashAccountingSystemV2.BackEnd.Configuration;

namespace DashAccountingSystemV2.BackEnd.Services.Caching
{
    public class GeneralPurposeLocalMemoryCache : IExtendedDistributedCache
    {
        private const int DEFAULT_CACHE_TTL_IN_SECONDS = 600; // 10 minutes

        private readonly MemoryDistributedCache _cache;
        private readonly ILogger _logger;

        public GeneralPurposeLocalMemoryCache(ILogger<GeneralPurposeLocalMemoryCache> logger)
        {
            _cache = new MemoryDistributedCache(OptionsHelper.Make<MemoryDistributedCacheOptions>());
            _logger = logger;
        }

        public byte[]? Get(string key)
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

        public Task<byte[]?> GetAsync(string key, CancellationToken token = default)
        {
            try
            {
                return _cache.GetAsync(key, token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed retrieving data from cache for key \'{key}\' (raw bytes / async)",
                    key);

                return Task.FromResult<byte[]?>(null);
            }
        }

        public async Task<TCachedData?> GetObjectAsync<TCachedData>(string key)
        {
            try
            {
                var bytes = await _cache.GetAsync(key);

                if (bytes == null || bytes.Length == 0)
                {
                    _logger.LogWarning("Null or empty byte array retrieved from cache for key \'{key}\'", key);
                    return default;
                }

                return Deserialize<TCachedData>(bytes);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed retrieving data from cache for key \'{key}\'", key);
            }

            return default;
        }

        public void Refresh(string key)
        {
            try
            {
                _cache.Refresh(key);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed refreshing data in cache for key \'{key}\'", key);
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
                _logger.LogWarning(ex, "Failed refreshing data in cache for key \'{key}\' (async)", key);
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
                _logger.LogWarning(ex, "Failed evicting data from cache for key \'{key}\'", key);
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
                _logger.LogWarning(ex, "Failed evicting data from cache for key \'{key}\'", key);
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
                _logger.LogWarning(ex, "Failed setting data in cache for key \'{key}\'", key);
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
                _logger.LogWarning(ex, "Failed setting data in in cache for key \'{key}\'", key);
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
            if (value == null)
            {
                _logger.LogWarning(
                    "Value of type {type} specified for cache for key \'{key}\' was null.  Not caching it.",
                    typeof(TCachedData).Name,
                    key);
            }

            try
            {
                var bytes = Serialize(value!);
                return _cache.SetAsync(key, bytes, options, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed setting data in in cache for key \'{key}\'", key);
                return Task.CompletedTask;
            }
        }

        #region Cache Entry Options Helpers
        private static DistributedCacheEntryOptions GetCacheEntryOptions(int absoluteExpirationInSeconds)
        {
            return GetCacheEntryOptions(TimeSpan.FromSeconds(absoluteExpirationInSeconds), false);
        }

        private static DistributedCacheEntryOptions GetCacheEntryOptions(TimeSpan expiration, bool isSlidingExpiration)
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
        private static byte[] Serialize(object value)
        {
            if (value == null) return [];

            var json = JsonSerializer.Serialize(value);
            var bytes = Encoding.UTF8.GetBytes(json);

            return bytes;
        }

        private static TCachedData? Deserialize<TCachedData>(byte[] serializedBytes)
        {
            if (serializedBytes == null || serializedBytes.Length == 0)
            {
                return default;
            }

            var json = Encoding.UTF8.GetString(serializedBytes);
            var obj = JsonSerializer.Deserialize<TCachedData>(json);

            return obj;
        }
        #endregion Serialization Helpers
    }
}
