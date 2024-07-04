using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Region
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }

        /// <summary>
        /// What "kind" of region this is, e.g. "State", "Province", etc.
        /// </summary>
        public string? Label { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(128)]
        public string Name { get; set; }

        /// <summary>
        /// ISO 3166-2 Code for the Region (only the regional/local segment; not including the parent Country code)
        /// </summary>
        /// <remarks>
        /// <see href="https://en.wikipedia.org/wiki/ISO_3166-2"/>
        /// </remarks>
        [Required(AllowEmptyStrings = false)]
        [MaxLength(3)]
        public string Code { get; set; }

        public int CountryId { get; set; }
        public Country Country { get; set; }
    }
}
