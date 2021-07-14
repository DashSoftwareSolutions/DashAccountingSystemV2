using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public class TimeActivityRepository : ITimeActivityRepository
    {
        private readonly ApplicationDbContext _db = null;

        public TimeActivityRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task DeleteAsync(Guid timeActivityId)
        {
            // TODO: For now, this is a _HARD_ delete.  Perhaps in the future we can consider soft-deletion if it makes sense (e.g. "Oops; I ddeleted it by accident!  Undo that please!")
            var entryToDelete = await _db.TimeActivity.FirstOrDefaultAsync(ta => ta.Id == timeActivityId);
            
            if (entryToDelete != null)
            {
                _db.TimeActivity.Remove(entryToDelete);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<TimeActivity> GetByIdAsync(Guid timeActivityId)
        {
            return await _db.TimeActivity
                .Where(ta => ta.Id == timeActivityId)
                .Include(ta => ta.Customer)
                .Include(ta => ta.Employee)
                .Include(ta => ta.ProductOrService)
                    .ThenInclude(p => p.Category)
                .Include(ta => ta.CreatedBy)
                .Include(ta => ta.UpdatedBy)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TimeActivity>> GetFiltered(Guid tenantId, DateTime dateRangeStart, DateTime dateRangeEnd, IEnumerable<Guid> includeCustomers = null, IEnumerable<Guid> includeEmployees = null)
        {
            return await _db.TimeActivity
                .Where(ta =>
                    ta.TenantId == tenantId &&
                    ta.Date <= dateRangeStart &&
                    ta.Date >= dateRangeEnd &&
                    (includeCustomers == null || includeCustomers.Any(c => c == ta.CustomerId)) &&
                    (includeEmployees == null || includeEmployees.Any(e => e == ta.EmployeeId))
                 )
                .Include(ta => ta.Customer)
                .Include(ta => ta.Employee)
                .Include(ta => ta.ProductOrService)
                .Include(ta => ta.CreatedBy)
                .Include(ta => ta.UpdatedBy)
                .OrderBy(ta => ta.Customer.DisplayName)
                .ThenBy(ta => ta.Employee.LastName)
                .ThenBy(ta => ta.Employee.FirstName)
                .ThenBy(ta => ta.Date)
                .ThenBy(ta => ta.StartTime)
                .ToListAsync();
        }

        public async Task<TimeActivity> InsertAsync(TimeActivity timeActivity)
        {
            await _db.TimeActivity.AddAsync(timeActivity);
            await _db.SaveChangesAsync();
            return await GetByIdAsync(timeActivity.Id);
        }

        public async Task<TimeActivity> UpdateAsync(TimeActivity timeActivity)
        {
            var entryToUpdate = await _db.TimeActivity.FirstOrDefaultAsync(ta => ta.Id == timeActivity.Id);

            if (entryToUpdate != null)
            {
                entryToUpdate.Description = timeActivity.Description;
                entryToUpdate.Date = timeActivity.Date;
                entryToUpdate.StartTime = timeActivity.StartTime;
                entryToUpdate.EndTime = timeActivity.EndTime;
                entryToUpdate.Break = timeActivity.Break;

                await _db.SaveChangesAsync();
                return await GetByIdAsync(timeActivity.Id);
            }

            return null;
        }
    }
}
