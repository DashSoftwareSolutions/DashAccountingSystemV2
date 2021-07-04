using System;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface IAccountingReportBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<BalanceSheetReportDto>> GetBalanceSheetReport(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd);

        Task<BusinessLogicResponse<ProfitAndLossReportDto>> GetProfitAndLossReport(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd);
    }
}
