using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
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
            IEnumerable<string> includeCustomers = null,
            IEnumerable<uint> includeEmployees = null);

        Task<BusinessLogicResponse<TimeActivity>> CreateTimeActivity(TimeActivity timeActivity);
    }
}
