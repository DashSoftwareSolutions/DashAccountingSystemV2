using System;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class TenantViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public AssetTypeViewModel DefaultAssetType { get; set; }

        public static TenantViewModel FromModel(Tenant tenant)
        {
            if (tenant == null)
                return null;

            return new TenantViewModel()
            {
                Id = tenant.Id,
                Name = tenant.Name,
                DefaultAssetType = AssetTypeViewModel.FromModel(tenant.DefaultAssetType),
            };
        }
    }
}
