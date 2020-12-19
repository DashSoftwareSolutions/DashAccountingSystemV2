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

        public AssetType(string name)
        {
            Name = name;
        }
    }
}
