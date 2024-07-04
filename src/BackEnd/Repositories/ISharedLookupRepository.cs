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

        Task<IEnumerable<Country>> GetCountriesAsync();

        Task<IEnumerable<PaymentMethod>> GetPaymentMethodsAsync();

        Task<IEnumerable<Region>> GetRegionsByCountryAsync(int countryId);

        Task<IEnumerable<Region>> GetRegionsByCountryAlpha2CodeAsync(string countryAlpha2Code);

        Task<IEnumerable<Region>> GetRegionsByCountryAlpha3CodeAsync(string countryAlpha3Code);
    }
}
