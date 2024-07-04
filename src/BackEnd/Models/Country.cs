using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Country
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(64)]
        public string Name { get; set; }

        /// <summary>
        /// ISO-3611-Alpha-2 two letter abbreviation
        /// </summary>
        [Required(AllowEmptyStrings = false)]
        [MinLength(2)]
        [MaxLength(2)]
        public string TwoLetterCode { get; set; }

        /// <summary>
        /// ISO-3611-Alpha-3 three letter abbreviation
        /// </summary>
        [Required(AllowEmptyStrings = false)]
        [MinLength(3)]
        [MaxLength(3)]
        public string ThreeLetterCode { get; set; }
    }
}
