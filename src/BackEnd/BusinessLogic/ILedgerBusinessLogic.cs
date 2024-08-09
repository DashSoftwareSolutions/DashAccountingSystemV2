using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public interface ILedgerBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<LedgerReportAccountDto>>> GetLedgerReport(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd);
    }
}
