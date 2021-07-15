using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Npgsql;
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

        public async Task<IEnumerable<TimeActivity>> GetFiltered(
            Guid tenantId,
            DateTime dateRangeStart,
            DateTime dateRangeEnd,
            IEnumerable<Guid> includeCustomers = null,
            IEnumerable<Guid> includeEmployees = null)
        {
            // EF has been less than awesome with filters and such; using Dapper for now
            /*return await _db.TimeActivity
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
                .ToListAsync();*/

            const string sql = @"
  SELECT ta.""Id"" as time_activity_id
        ,ta.*
        ,c.""EntityId"" AS customer_id
        ,c.*
        ,e.""EntityId"" AS employee_id
        ,e.*
        ,p.""Id"" AS product_id
        ,p.*
        ,pc.""Id"" AS product_category_id
        ,pc.*
        ,created_by.""Id"" as created_by_id
        ,created_by.*
        ,updated_by.""Id"" AS updated_by_id
        ,updated_by.*
    FROM ""TimeActivity"" ta
         INNER JOIN ""Customer"" c
                 ON ta.""CustomerId"" = c.""EntityId""
         INNER JOIN ""Employee"" e
                 ON ta.""EmployeeId"" = e.""EntityId""
         INNER JOIN ""Product"" p
                 ON ta.""ProductId"" = p.""Id""
         INNER JOIN ""ProductCategory"" pc
                 ON p.""CategoryId"" = pc.""Id""
         INNER JOIN ""AspNetUsers"" created_by
                 ON ta.""CreatedById"" = created_by.""Id""
          LEFT JOIN ""AspNetUsers"" updated_by
                 ON ta.""UpdatedById"" = updated_by.""Id""
   WHERE ta.""TenantId"" = @tenantId
     AND ta.""Date"" BETWEEN @dateRangeStart AND @dateRangeEnd
     AND ( @includeCustomers::UUID[] IS NULL OR ta.""CustomerId"" = ANY ( @includeCustomers ) )
     AND ( @includeEmployees::UUID[] IS NULL OR ta.""EmployeeId"" = ANY ( @includeEmployees ) )
ORDER BY c.""DisplayName""
        ,e.""LastName""
        ,e.""FirstName""
        ,ta.""Date""
        ,ta.""StartTime"";
";
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                return await connection.QueryAsync<
                    TimeActivity,
                    Customer,
                    Employee,
                    Product,
                    ProductCategory,
                    ApplicationUser,
                    ApplicationUser,
                    TimeActivity
                    >(
                        sql,
                        (timeActivity, customer, employee, product, productCategory, createdBy, updatedBy) =>
                        {
                            if (timeActivity != null)
                            {
                                if (product != null)
                                {
                                    product.Category = productCategory;
                                }

                                timeActivity.Customer = customer;
                                timeActivity.Employee = employee;
                                timeActivity.ProductOrService = product;
                                timeActivity.CreatedBy = createdBy;
                                timeActivity.UpdatedBy = updatedBy != null && updatedBy.Id != Guid.Empty ? updatedBy : null;
                            }

                            return timeActivity;
                        },
                        param: new
                        {
                            tenantId,
                            dateRangeStart,
                            dateRangeEnd,
                            includeCustomers = includeCustomers.AsList(),
                            includeEmployees = includeEmployees.AsList(),
                        },
                        splitOn: "time_activity_id,customer_id,employee_id,product_id,product_category_id,created_by_id,updated_by_id");
            }
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
