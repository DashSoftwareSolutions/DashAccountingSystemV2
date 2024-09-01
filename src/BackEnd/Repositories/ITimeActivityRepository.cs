using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
{
    public interface ITimeActivityRepository
    {
        Task<TimeActivity> GetByIdAsync(Guid timeActivityId);

        Task<IEnumerable<TimeActivity>> GetFilteredAsync(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            IEnumerable<Guid>? includeCustomers = null,
            IEnumerable<Guid>? includeEmployees = null);

        Task<IEnumerable<TimeActivity>> GetUnbilledItemsForInvoicingAsync(
            Guid customerId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd);

        Task<TimeActivity> InsertAsync(TimeActivity timeActivity);

        Task<TimeActivity> UpdateAsync(TimeActivity timeActivity, Guid contextUserId);

        Task DeleteAsync(Guid timeActivityId, Guid contextUserId);
    }
}
