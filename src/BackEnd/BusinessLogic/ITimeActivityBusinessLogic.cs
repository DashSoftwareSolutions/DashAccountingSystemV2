using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface ITimeActivityBusinessLogic : IBusinessLogic
    {
        /// <summary>
        /// Gets data for the Time Activities Details Report (Timesheet)
        /// </summary>
        /// <param name="tenantId">Tenant ID</param>
        /// <param name="dateRangeStart">Start date for the report date range</param>
        /// <param name="dateRangeEnd">End date for the report date range</param>
        /// <param name="includeCustomers">Collection of Customer Numbers to include</param>
        /// <param name="includeEmployee">Collection of Employee Numbers to include</param>
        /// <returns></returns>
        Task<BusinessLogicResponse<TimeActivityDetailsReportDto>> GetTimeActivitiesDetailReportData(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            IEnumerable<string>? includeCustomers = null,
            IEnumerable<uint>? includeEmployees = null);

        Task<BusinessLogicResponse<IEnumerable<TimeActivity>>> GetUnbilledTimeActivitiesForInvoicing(
            Guid tenantId,
            string customerNumber,
            DateTime dateRangeStart,
            DateTime dateRangeEnd);

        Task<BusinessLogicResponse<TimeActivity>> CreateTimeActivity(TimeActivity timeActivity);

        Task<BusinessLogicResponse<TimeActivity>> UpdateTimeActivity(TimeActivity timeActivity, Guid contextUserId);

        Task<BusinessLogicResponse> DeleteTimeActivity(Guid timeActivityId, Guid contextUserId);
    }
}
