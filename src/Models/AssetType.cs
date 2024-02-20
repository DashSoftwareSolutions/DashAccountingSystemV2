using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class AssetType : IEquatable<AssetType>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(1024)]
        public string? Description { get; set; }

        [MaxLength(4)]
        public string? Symbol { get; set; }

        public AssetType() { }

        public AssetType(string name, string? symbol = null)
        {
            Name = name;
            Symbol = symbol;
        }

        public AssetType(int id, string name, string symbol)
            : this(name, symbol)
        {
            Id = id;
        }

        public bool Equals(AssetType? other)
        {
            if (other == null)
                return false;

            return Id == other.Id;
        }

        public override bool Equals(object? obj)
        {
            if (obj is AssetType other)
            {
                return Equals(other);
            }

            return false;
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
