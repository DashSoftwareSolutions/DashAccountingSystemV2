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
    public class TenantRepository : ITenantRepository
    {
        private readonly ApplicationDbContext _db = null;

        public TenantRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<Tenant> GetTenantAsync(Guid tenantId)
        {
            return await _db
                .Tenant
                .Include(t => t.DefaultAssetType)
                .FirstOrDefaultAsync(t => t.Id == tenantId);
        }

        public async Task<Tenant> GetTenantDetailedAsync(Guid tenantId)
        {
            var sql = $@"
  SELECT t.""Id"" AS tenant_id
        ,t.""Id""
        ,t.""Name""
        ,t.""ContactEmailAddress""
        ,t.""DefaultAssetTypeId""
        -- Asset Type
        ,at2.""Id"" AS asset_type_id
        ,at2.""Id""
        ,at2.""Name""
        ,at2.""Symbol""
        ,at2.""Description""
        -- Entity
        ,e.""Id"" AS entity_id
        ,e.""Id""
        ,e.""TenantId""
        ,e.""EntityType""
        ,e.""Created""
        ,e.""CreatedById""
        ,e.""Updated""
        ,e.""UpdatedById""
        ,e.""Inactivated""
        ,e.""InactivatedById""
        -- Mailing Address
        ,a.""Id"" AS address_id
        ,a.""Id""
        ,a.""TenantId""
        ,a.""EntityId""
        ,a.""AddressType""
        ,a.""StreetAddress1""
        ,a.""StreetAddress2""
        ,a.""City""
        ,a.""RegionId""
        ,a.""CountryId""
        ,a.""PostalCode""
        ,a.""Created""
        ,a.""CreatedById""
        ,a.""Updated""
        ,a.""UpdatedById""
        -- Mailing Address Region
        ,r.""Id"" AS region_id
        ,r.""Id""
        ,r.""Label""
        ,r.""Name""
        ,r.""Code""
        ,r.""CountryId""
        -- Mailing Address Country
        ,c.""Id"" AS country_id
        ,c.""Id""
        ,c.""Name""
        ,c.""TwoLetterCode""
        ,c.""ThreeLetterCode""
    FROM ""Tenant"" t
         LEFT JOIN ""AssetType"" at2
                ON t.""DefaultAssetTypeId"" = at2.""Id""
         LEFT JOIN ""Entity"" e
                ON t.""Id"" = e.""TenantId""
               AND e.""EntityType"" = {(int)EntityType.Tenant}
         LEFT JOIN ""Address"" a
                ON e.""Id"" = a.""EntityId""
               AND t.""Id"" = a.""TenantId""
         LEFT JOIN ""Region"" r
                ON a.""RegionId"" = r.""Id""
         LEFT JOIN ""Country"" c
                ON a.""CountryId"" = c.""Id""
   WHERE t.""Id"" = @tenantId;
";
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                return (await connection.QueryAsync<
                    Tenant,
                    AssetType,
                    Entity,
                    Address,
                    Region,
                    Country,
                    Tenant
                    >(
                    sql,
                    (tenant, defaultAssetType, tenantEntity, tenantMailingAddress, region, country) =>
                    {
                        if (tenant != null)
                        {
                            tenant.DefaultAssetType = defaultAssetType;

                            if (tenantMailingAddress != null)
                            {
                                tenantMailingAddress.Tenant = tenant;
                                tenantMailingAddress.Entity = tenantEntity;
                                tenantMailingAddress.Region = region;
                                tenantMailingAddress.Country = country;

                                tenant.MailingAddress = tenantMailingAddress;
                            }
                        }

                        return tenant;
                    },
                    new { tenantId },
                    splitOn: "tenant_id,asset_type_id,entity_id,address_id,region_id,country_id"))
                        .FirstOrDefault();
            }
        }

        public async Task<Tenant> GetTenantByNameAsync(string tenantName)
        {
            return await _db
                .Tenant
                .Include(t => t.DefaultAssetType)
                .FirstOrDefaultAsync(t => t.Name.ToLower() == tenantName.ToLower());
        }

        public async Task<Tenant> GetTenantDetailedByNameAsync(string tenantName)
        {
            var sql = $@"
  SELECT t.""Id"" AS tenant_id
        ,t.""Id""
        ,t.""Name""
        ,t.""ContactEmailAddress""
        ,t.""DefaultAssetTypeId""
        -- Asset Type
        ,at2.""Id"" AS asset_type_id
        ,at2.""Id""
        ,at2.""Name""
        ,at2.""Symbol""
        ,at2.""Description""
        -- Entity
        ,e.""Id"" AS entity_id
        ,e.""Id""
        ,e.""TenantId""
        ,e.""EntityType""
        ,e.""Created""
        ,e.""CreatedById""
        ,e.""Updated""
        ,e.""UpdatedById""
        ,e.""Inactivated""
        ,e.""InactivatedById""
        -- Mailing Address
        ,a.""Id"" AS address_id
        ,a.""Id""
        ,a.""TenantId""
        ,a.""EntityId""
        ,a.""AddressType""
        ,a.""StreetAddress1""
        ,a.""StreetAddress2""
        ,a.""City""
        ,a.""RegionId""
        ,a.""CountryId""
        ,a.""PostalCode""
        ,a.""Created""
        ,a.""CreatedById""
        ,a.""Updated""
        ,a.""UpdatedById""
        -- Mailing Address Region
        ,r.""Id"" AS region_id
        ,r.""Id""
        ,r.""Label""
        ,r.""Name""
        ,r.""Code""
        ,r.""CountryId""
        -- Mailing Address Country
        ,c.""Id"" AS country_id
        ,c.""Id""
        ,c.""Name""
        ,c.""TwoLetterCode""
        ,c.""ThreeLetterCode""
    FROM ""Tenant"" t
         LEFT JOIN ""AssetType"" at2
                ON t.""DefaultAssetTypeId"" = at2.""Id""
         LEFT JOIN ""Entity"" e
                ON t.""Id"" = e.""TenantId""
               AND e.""EntityType"" = {(int)EntityType.Tenant}
         LEFT JOIN ""Address"" a
                ON e.""Id"" = a.""EntityId""
               AND t.""Id"" = a.""TenantId""
         LEFT JOIN ""Region"" r
                ON a.""RegionId"" = r.""Id""
         LEFT JOIN ""Country"" c
                ON a.""CountryId"" = c.""Id""
   WHERE LOWER( t.""Name"" ) = LOWER( @tenantName );
";
            using (var connection = new NpgsqlConnection(_db.Database.GetConnectionString()))
            {
                return (await connection.QueryAsync<
                    Tenant,
                    AssetType,
                    Entity,
                    Address,
                    Region,
                    Country,
                    Tenant
                    >(
                    sql,
                    (tenant, defaultAssetType, tenantEntity, tenantMailingAddress, region, country) =>
                    {
                        if (tenant != null)
                        {
                            tenant.DefaultAssetType = defaultAssetType;

                            if (tenantMailingAddress != null)
                            {
                                tenantMailingAddress.Tenant = tenant;
                                tenantMailingAddress.Entity = tenantEntity;
                                tenantMailingAddress.Region = region;
                                tenantMailingAddress.Country = country;

                                tenant.MailingAddress = tenantMailingAddress;
                            }
                        }

                        return tenant;
                    },
                    new { tenantName },
                    splitOn: "tenant_id,asset_type_id,entity_id,address_id,region_id,country_id"))
                        .FirstOrDefault();
            }
        }

        public async Task<IEnumerable<Tenant>> GetTenantsAsync()
        {
            return await _db
                .Tenant
                .Include(t => t.DefaultAssetType)
                .OrderBy(t => t.Name)
                .ToListAsync();
        }
    }
}
