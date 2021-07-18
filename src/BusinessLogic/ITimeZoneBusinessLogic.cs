using System.Collections.Generic;
using System.Threading.Tasks;
using TimeZone = DashAccountingSystemV2.Models.TimeZone;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface ITimeZoneBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<TimeZone>>> GetTimeZones();
    }
}
