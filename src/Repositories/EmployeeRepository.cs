using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _db = null;

        public EmployeeRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<Employee> InsertAsync(Employee employee)
        {
            if (employee == null)
                throw new ArgumentNullException(nameof(employee));

            if (employee.Entity == null)
                throw new ArgumentNullException(nameof(employee.Entity));

            using (var transaction = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    // Base Entity
                    await _db.Entity.AddAsync(employee.Entity);
                    await _db.SaveChangesAsync();
                    employee.EntityId = employee.Entity.Id;

                    // Mailing Address
                    if (employee.MailingAddress != null &&
                        !string.IsNullOrWhiteSpace(employee.MailingAddress.StreetAddress1) &&
                        !string.IsNullOrWhiteSpace(employee.MailingAddress.City) &&
                        employee.MailingAddress.CountryId != 0)
                    {
                        employee.MailingAddress.EntityId = employee.Entity.Id;
                    }
                    else
                    {
                        employee.MailingAddress = null;
                    }

                    await _db.AddAsync(employee);
                    await _db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return await GetByEntityIdAsync(employee.EntityId);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<Employee> GetByEntityIdAsync(Guid entityId)
        {
            return await _db.Employee
                .Where(e => e.EntityId == entityId)
                .Include(e => e.Entity)
                    .ThenInclude(e => e.CreatedBy)
                .Include(e => e.Entity)
                    .ThenInclude(e => e.UpdatedBy)
                .Include(e => e.MailingAddress)
                    .ThenInclude(ma => ma.Country)
                .Include(e => e.MailingAddress)
                    .ThenInclude(ma => ma.Region)
                .Include(e => e.User)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Employee>> GetByTenantIdAsync(Guid tenantId, bool onlyActive = true)
        {
            return await _db.Employee
                .Include(e => e.Entity)
                .Where(e => e.Entity.TenantId == tenantId)
                .Include(e => e.User)
                .OrderBy(e => e.LastName)
                .ThenBy(e => e.FirstName)
                .ToListAsync();
        }

        public Task<Employee> GetByUserIdAsync(Guid userId)
        {
            throw new NotImplementedException();
        }

        public Task<Employee> UpdateAsync(Employee employee)
        {
            throw new NotImplementedException();
        }
    }
}
