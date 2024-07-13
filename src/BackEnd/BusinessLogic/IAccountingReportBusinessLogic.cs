using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
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
