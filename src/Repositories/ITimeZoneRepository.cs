using TimeZone = DashAccountingSystemV2.Models.TimeZone;

namespace DashAccountingSystemV2.Repositories
{
    public interface ITimeZoneRepository
    {
        Task<IEnumerable<TimeZone>> GetTimeZones();
    }
}
