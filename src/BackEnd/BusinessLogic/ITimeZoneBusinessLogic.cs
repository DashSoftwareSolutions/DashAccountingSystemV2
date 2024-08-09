using TimeZone = DashAccountingSystemV2.BackEnd.Models.TimeZone;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface ITimeZoneBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<TimeZone>>> GetTimeZones();
    }
}
