using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DashAccountingSystemV2.Data;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public class SharedLookupRepository : ISharedLookupRepository
    {
        private readonly ApplicationDbContext _db = null;

        public SharedLookupRepository(ApplicationDbContext applicationDbContext)
        {
            _db = applicationDbContext;
        }

        public async Task<IEnumerable<AccountType>> GetAccountTypesAsync()
        {
            return await _db.AccountType.ToListAsync();
        }

        public async Task<IEnumerable<AccountSubType>> GetAccountSubTypesAsync()
        {
            return await _db
                .AccountSubType
                .Include(ast => ast.AccountType)
                .ToListAsync();
        }

        public async Task<IEnumerable<AssetType>> GetAssetTypesAsync()
        {
            return await _db.AssetType.ToListAsync();
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            return await _db
                .Country
                .OrderBy(c => c.TwoLetterCode == "US" ? 1 : 2)
                .ThenBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<PaymentMethod>> GetPaymentMethodsAsync()
        {
            return await _db
                .PaymentMethod
                .OrderBy(pm => pm.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Region>> GetRegionsByCountryAsync(int countryId)
        {
            return await _db
                .Region
                .Where(r => r.CountryId == countryId)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Region>> GetRegionsByCountryAlpha2CodeAsync(string countryAlpha2Code)
        {
            return await _db
                .Region
                .Include(r => r.Country)
                .Where(r => r.Country.TwoLetterCode == countryAlpha2Code)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Region>> GetRegionsByCountryAlpha3CodeAsync(string countryAlpha3Code)
        {
            return await _db
                .Region
                .Include(r => r.Country)
                .Where(r => r.Country.ThreeLetterCode == countryAlpha3Code)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }
    }
}
