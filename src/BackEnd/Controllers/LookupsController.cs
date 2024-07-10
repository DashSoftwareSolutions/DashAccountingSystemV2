using Microsoft.AspNetCore.Mvc;
using DashAccountingSystemV2.BackEnd.BusinessLogic;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Repositories;
using DashAccountingSystemV2.BackEnd.ViewModels;
using DashAccountingSystemV2.BackEnd.Security.Authorization;

namespace DashAccountingSystemV2.BackEnd.Controllers
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/lookups")]
    public class LookupsController(
        ISharedLookupRepository sharedLookupRepository,
        ITimeZoneBusinessLogic timeZoneBusinessLogic) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetLookups()
        {
            var accountTypes = await sharedLookupRepository.GetAccountTypesAsync();
            var accountSubTypes = await sharedLookupRepository.GetAccountSubTypesAsync();
            var assetTypes = await sharedLookupRepository.GetAssetTypesAsync();
            var paymentMethods = await sharedLookupRepository.GetPaymentMethodsAsync();
            var timeZonesBizLogResponse = await timeZoneBusinessLogic.GetTimeZones();

            if (!timeZonesBizLogResponse.IsSuccessful)
                return this.ErrorResponse(timeZonesBizLogResponse);

            var result = new LookupsViewModel()
            {
                AccountTypes = accountTypes.Select(at => new LookupValueViewModel(at.Id, at.Name)),
                AccountSubTypes = accountSubTypes.Select(AccountSubTypeViewModel.FromModel),
                AssetTypes = assetTypes.Select(ExtendedAssetTypeViewModel.FromModel),
                PaymentMethods = paymentMethods.Select(pm => new LookupValueViewModel(pm.Id, pm.Name)),
                TimeZones = timeZonesBizLogResponse.Data,
            };

            return Ok(result);
        }
    }
}
