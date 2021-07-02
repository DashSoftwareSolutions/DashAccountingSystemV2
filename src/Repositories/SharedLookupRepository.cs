using System.Collections.Generic;
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
            return await _db.AccountSubType.ToListAsync();
        }

        public async Task<IEnumerable<AssetType>> GetAssetTypesAsync()
        {
            return await _db.AssetType.ToListAsync();
        }
    }
}
