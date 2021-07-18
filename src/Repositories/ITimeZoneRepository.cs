using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface ITimeZoneRepository
    {
        Task<IEnumerable<TimeZone>> GetTimeZones();
    }
}
