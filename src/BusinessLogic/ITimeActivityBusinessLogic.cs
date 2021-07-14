using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface ITimeActivityBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<TimeActivity>> CreateTimeActivity(TimeActivity timeActivity);
    }
}
