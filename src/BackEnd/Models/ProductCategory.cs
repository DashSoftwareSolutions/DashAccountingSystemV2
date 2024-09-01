using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class ProductCategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; private set; }

        [Required]
        public Guid TenantId { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(256)]
        public string Name { get; set; }

        /// <summary>
        /// For unique index on Name
        /// </summary>
        /// <remarks>
        /// EF is LAME and cannot allow UPPER() or LOWER() in index expression
        /// </remarks>
        public string? NormalizedName
        {
            get { return Name?.ToUpperInvariant(); }
            set { }
        }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Column(TypeName = "TIMESTAMP")]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; private set; }

        [Column(TypeName = "TIMESTAMP")]
        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; private set; }
    }
}
