using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class AmountViewModel : IEquatable<AmountViewModel>
    {
        public static readonly AmountViewModel Empty = new AmountViewModel(null, null);

        public decimal? Amount { get; set; }
        public LookupValueViewModel AssetType { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public AmountType AmountType
        {
            get
            {
                if (Amount.HasValue && Amount < 0.0m)
                    return AmountType.Credit;
                else
                    return AmountType.Debit;
            }
        }

        public bool HasValue
        {
            get { return Amount.HasValue && AssetType != null; }
        }

        public AmountViewModel() { }

        public AmountViewModel(decimal? amount, AssetType assetType)
        {
            Amount = amount;
            AssetType = assetType == null ? null : new LookupValueViewModel(assetType.Id, assetType.Name);
        }

        public AmountViewModel(decimal? amount, int assetTypeId, string assetTypeName)
        {
            Amount = amount;
            AssetType = new LookupValueViewModel(assetTypeId, assetTypeName);
        }

        public bool Equals(AmountViewModel other)
        {
            if (other == null)
                return false;

            return Amount == other.Amount && AssetType?.Id == other?.AssetType.Id;
        }

        public override bool Equals(object obj)
        {
            if (obj is AmountViewModel other)
                return Equals(other);

            return false;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hash = 17;
                hash = hash * 23 + (Amount ?? 0.0m).GetHashCode();
                hash = hash * 23 + AssetType?.Id.GetHashCode() ?? 0;
                return hash;
            }
        }
    }
}
