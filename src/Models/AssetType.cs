using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class AssetType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(255)]
        public string Name { get; set; }

        public char? Symbol { get; set; }

        public AssetType(string name, char? symbol = null)
        {
            Name = name;
            Symbol = symbol;
        }

        public AssetType(int id, string name, char? symbol)
        {
            Id = id;
            Name = name;
            Symbol = symbol;
        }
    }
}
