using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Repositories;
using DashAccountingSystemV2.Services.Caching;
using DashAccountingSystemV2.Services.Time;
using TimeZone = DashAccountingSystemV2.Models.TimeZone;
using static DashAccountingSystemV2.Services.Caching.Constants;

namespace DashAccountingSystemV2.BusinessLogic
{
    public class TimeZoneBusinessLogic : ITimeZoneBusinessLogic
    {
        private readonly ITimeZoneRepository _timeZoneRepository = null;
        private readonly ITimeProvider _timeProvider = null;
        private readonly IExtendedDistributedCache _cache = null;
        private readonly ILogger _logger = null;

        private static readonly string _CacheKey = $"{ApplicationCacheKeyPrefix}/TimeZones";

        public TimeZoneBusinessLogic(
            ITimeZoneRepository timeZoneRepository,
            ITimeProvider timeProvider,
            IExtendedDistributedCache cache,
            ILogger<TimeZoneBusinessLogic> logger)
        {
            _timeZoneRepository = timeZoneRepository;
            _timeProvider = timeProvider;
            _cache = cache;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<IEnumerable<TimeZone>>> GetTimeZones()
        {
            var cached = await _cache.GetObjectAsync<IEnumerable<TimeZone>>(_CacheKey);
            
            if (cached.HasAny())
            {
                _logger.LogDebug("Retrieved system Time Zones list from from cache");
                return new BusinessLogicResponse<IEnumerable<TimeZone>>(cached);
            }

            _logger.LogDebug("Fetching system Time Zones list from the repsoitory");
            var fresh = await _timeZoneRepository.GetTimeZones();

            _ = Task.Run(async () =>
            {
                _logger.LogDebug("Caching the system time zones for 12 hours");
                await _cache.SetObjectAsync<IEnumerable<TimeZone>>(_CacheKey, fresh, TimeSpan.FromHours(12));
            });

            return new BusinessLogicResponse<IEnumerable<TimeZone>>(fresh);
        }
    }
}
