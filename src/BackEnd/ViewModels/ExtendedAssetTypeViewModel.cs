using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class ExtendedAssetTypeViewModel : AssetTypeViewModel
    {
        public string Description { get; set; }

        public static new ExtendedAssetTypeViewModel FromModel(AssetType assetType)
        {
            if (assetType == null)
                return null;

            return new ExtendedAssetTypeViewModel()
            {
                Id = assetType.Id,
                Name = assetType.Name,
                Description = assetType.Description,
                Symbol = assetType.Symbol,
            };
        }
    }
}
