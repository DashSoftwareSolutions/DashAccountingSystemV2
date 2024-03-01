using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.BusinessLogic
{
    public interface ILedgerBusinessLogic : IBusinessLogic
    {
        Task<BusinessLogicResponse<IEnumerable<LedgerReportAccountDto>>> GetLedgerReport(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd);
    }
}
