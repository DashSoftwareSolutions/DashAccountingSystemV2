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
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _db = null;

        public CustomerRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<Customer> GetByEntityIdAsync(Guid entityId)
        {
            return await _db.Customer
                .Where(c => c.EntityId == entityId)
                .Include(c => c.Entity)
                    .ThenInclude(e => e.CreatedBy)
                .Include(c => c.Entity)
                    .ThenInclude(e => e.UpdatedBy)
                .Include(c => c.ShippingAddress)
                    .ThenInclude(sa => sa.Country)
                .Include(c => c.ShippingAddress)
                    .ThenInclude(sa => sa.Region)
                .Include(c => c.BillingAddress)
                    .ThenInclude(ba => ba.Country)
                .Include(c => c.BillingAddress)
                    .ThenInclude(ba => ba.Region)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Customer>> GetByTenantIdAsync(
            Guid tenantId,
            IEnumerable<string> customerNumbers = null,
            bool onlyActive = true)
        {
            // Not working so well :-(
            //return await _db.Customer
            //    .Include(c => c.Entity)
            //    .Where(c =>
            //        c.TenantId == tenantId &&
            //        (customNumbers == null || customNumbers.Contains(c.CustomerNumber)) &&
            //        (!onlyActive || c.Entity.IsActive))
            //    .OrderBy(c => c.DisplayName)
            //    .ToListAsync();

            const string sql = @"
  SELECT c.""EntityId"" as entity_id
        ,c.*
        ,e.""Id"" as id
        ,e.*
    FROM ""Customer"" c
         INNER JOIN ""Entity"" e
                 ON c.""EntityId"" = e.""Id""
   WHERE c.""TenantId"" = @tenantId
     AND ( NOT @onlyActive OR e.""Inactivated"" IS NULL )
     AND ( @customerNumbers::VARCHAR[] IS NULL OR c.""CustomerNumber"" = ANY ( @customerNumbers ) )
ORDER BY c.""DisplayName"";
";
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                return await connection.QueryAsync<Customer, Entity, Customer>(
                    sql,
                    (customer, entity) =>
                    {
                        if (customer != null)
                        {
                            customer.Entity = entity;
                        }

                        return customer;
                    },
                    param: new { tenantId, customerNumbers = customerNumbers.AsList(), onlyActive },
                    splitOn: "entity_id,id");
            }
        }

        public async Task<Customer> InsertAsync(Customer customer)
        {
            if (customer == null)
                throw new ArgumentNullException(nameof(customer));

            if (customer.Entity == null)
                throw new ArgumentNullException(nameof(customer.Entity));

            using (var transaction = await _db.Database.BeginTransactionAsync())
            {
                try
                {
                    // Base Entity
                    await _db.Entity.AddAsync(customer.Entity);
                    await _db.SaveChangesAsync();
                    customer.EntityId = customer.Entity.Id;

                    // Billing Address
                    if (customer.BillingAddress != null &&
                        !string.IsNullOrWhiteSpace(customer.BillingAddress.StreetAddress1) &&
                        !string.IsNullOrWhiteSpace(customer.BillingAddress.City) &&
                        customer.BillingAddress.CountryId != 0)
                    {
                        customer.BillingAddress.EntityId = customer.Entity.Id;
                    }
                    else
                    {
                        customer.BillingAddress = null;
                    }

                    // Shipping Address
                    if (customer.ShippingAddress != null &&
                        !string.IsNullOrWhiteSpace(customer.ShippingAddress.StreetAddress1) &&
                        !string.IsNullOrWhiteSpace(customer.ShippingAddress.City) &&
                        customer.ShippingAddress.CountryId != 0)
                    {
                        customer.ShippingAddress.EntityId = customer.Entity.Id;
                    }
                    else
                    {
                        customer.ShippingAddress = null;
                    }


                    await _db.AddAsync(customer);
                    await _db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return await GetByEntityIdAsync(customer.EntityId);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public Task<Customer> UpdateAsync(Customer customer)
        {
            throw new NotImplementedException();
        }
    }
}
