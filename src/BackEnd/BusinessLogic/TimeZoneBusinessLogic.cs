using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Repositories;
using DashAccountingSystemV2.BackEnd.Services.Caching;
using TimeZone = DashAccountingSystemV2.BackEnd.Models.TimeZone;
using static DashAccountingSystemV2.BackEnd.Services.Caching.Constants;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class TimeZoneBusinessLogic(
        ITimeZoneRepository timeZoneRepository,
        IExtendedDistributedCache cache,
        ILogger<TimeZoneBusinessLogic> logger)
        : ITimeZoneBusinessLogic
    {


        private static readonly string _CacheKey = $"{ApplicationCacheKeyPrefix}/TimeZones";

        public async Task<BusinessLogicResponse<IEnumerable<TimeZone>>> GetTimeZones()
        {
            var cached = await cache.GetObjectAsync<IEnumerable<TimeZone>>(_CacheKey);

#pragma warning disable CS8604 // Possible null reference argument.  (We're using our hand-dandy HasAny() extension; it handles nulls.)
            if (cached.HasAny())
            {
                logger.LogDebug("Retrieved system Time Zones list from from cache");
                return new BusinessLogicResponse<IEnumerable<TimeZone>>(cached);
            }
#pragma warning restore CS8604 // Possible null reference argument.

            logger.LogDebug("Fetching system Time Zones list from the repository");
            var fresh = await timeZoneRepository.GetTimeZones();

            _ = Task.Run(async () =>
            {
                logger.LogDebug("Caching the system time zones for 12 hours");
                await cache.SetObjectAsync(_CacheKey, fresh, TimeSpan.FromHours(12));
            });

            return new BusinessLogicResponse<IEnumerable<TimeZone>>(fresh);
        }
    }
}
