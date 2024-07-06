using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Npgsql;
using DashAccountingSystemV2.BackEnd.Data;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Repositories
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

        public async Task<IEnumerable<Employee>> GetByTenantIdAsync(
            Guid tenantId,
            IEnumerable<uint> employeeNumbers = null,
            bool onlyActive = true)
        {
            // EF is not handling filtering well; using Dapper...
            //return await _db.Employee
            //    .Include(e => e.Entity)
            //    .Where(e =>
            //        e.TenantId == tenantId &&
            //        (!onlyActive || e.Entity.IsActive)) // TODO: Does "ReleaseDate" factor into this...?
            //    .Include(e => e.User)
            //    .OrderBy(e => e.LastName)
            //    .ThenBy(e => e.FirstName)
            //    .ToListAsync();

            const string sql = @"
  SELECT emp.""EntityId"" AS entity_id
        ,emp.*
        ,entity.""Id"" AS id
        ,entity.*
        ,app_user.""Id"" as id
        ,app_user.*
    FROM ""Employee"" emp
         INNER JOIN ""Entity"" entity
                 ON emp.""EntityId"" = entity.""Id""
          LEFT JOIN ""AspNetUsers"" app_user
                 ON emp.""UserId"" = app_user.""Id""
   WHERE emp.""TenantId"" = @tenantId
     AND ( NOT @onlyActive OR entity.""Inactivated"" IS NULL ) -- TODO: Does emp.""ReleaseDate"" factor into this...?
     AND ( @employeeNumbers::BIGINT[] IS NULL OR emp.""EmployeeNumber"" = ANY ( @employeeNumbers ) )
ORDER BY emp.""LastName""
        ,emp.""FirstName"";
";
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                return await connection.QueryAsync<Employee, Entity, ApplicationUser, Employee>(
                    sql,
                    (employee, entity, user) =>
                    {
                        if (employee != null)
                        {
                            employee.Entity = entity;
                            employee.User = user;
                        }

                        return employee;
                    },
                    param: new
                    {
                        tenantId,
                        onlyActive,
                        employeeNumbers = employeeNumbers
                            ?.Select(en => (long)en) // 1) Dapper / Npgsql / PostgreSQL don't do uints / 2) You might think Cast<long>() but apparently not
                            .AsList(),
                    },
                    splitOn: "entity_id,id,id");
            }
        }

        public async Task<Employee> GetByUserIdAsync(Guid tenantId, Guid userId)
        {
            return await _db.Employee
                .Where(e =>
                    e.TenantId == tenantId &&
                    e.UserId == userId)
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

        public Task<Employee> UpdateAsync(Employee employee)
        {
            throw new NotImplementedException();
        }
    }
}
