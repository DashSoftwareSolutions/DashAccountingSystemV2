using TimeZone = DashAccountingSystemV2.BackEnd.Models.TimeZone;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface ITimeZoneRepository
    {
        Task<IEnumerable<TimeZone>> GetTimeZones();
    }
}
