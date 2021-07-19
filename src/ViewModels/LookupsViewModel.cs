using System.Collections.Generic;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class LookupsViewModel
    {
        public IEnumerable<LookupValueViewModel> AccountTypes { get; set; }
        public IEnumerable<LookupValueViewModel> AccountSubTypes { get; set; }
        public IEnumerable<ExtendedAssetTypeViewModel> AssetTypes { get; set; }
        public IEnumerable<TimeZone> TimeZones { get; set; }
    }
}
