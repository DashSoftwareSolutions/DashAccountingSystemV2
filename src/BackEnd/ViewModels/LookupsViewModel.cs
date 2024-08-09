using TimeZone = DashAccountingSystemV2.BackEnd.Models.TimeZone;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class LookupsViewModel
    {
        public IEnumerable<LookupValueViewModel> AccountTypes { get; set; }
        public IEnumerable<LookupValueViewModel> AccountSubTypes { get; set; }
        public IEnumerable<ExtendedAssetTypeViewModel> AssetTypes { get; set; }
        public IEnumerable<LookupValueViewModel> PaymentMethods { get; set; }
        public IEnumerable<TimeZone> TimeZones { get; set; }
    }
}
