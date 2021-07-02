using System.Collections.Generic;
using System.Threading.Tasks;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.Repositories
{
    public interface ISharedLookupRepository
    {
        Task<IEnumerable<AccountType>> GetAccountTypesAsync();

        Task<IEnumerable<AccountSubType>> GetAccountSubTypesAsync();

        Task<IEnumerable<AssetType>> GetAssetTypesAsync();
    }
}
