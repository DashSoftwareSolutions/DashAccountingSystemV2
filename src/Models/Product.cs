using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; private set; }

        [Required]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; private set; }

        [Required]
        public ProductType Type { get; set; }

        [Required]
        public Guid CategoryId { get; set; }
        public ProductCategory Category { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(256)]
        public string Name { get; set; }

        /// <summary>
        /// For unique index on Name
        /// </summary>
        /// <remarks>
        /// EF is LAME and cannot allow UPPER() or LOWER() in index expression
        /// </remarks>
        public string NormalizedName
        {
            get { return Name?.ToUpperInvariant(); }
            set { }
        }

        [MaxLength(256)]
        public string SKU { get; set; }

        /// <summary>
        /// For unique index on Name
        /// </summary>
        /// <remarks>
        /// EF is LAME and cannot allow UPPER() or LOWER() in index expression
        /// </remarks>
        public string NormalizedSKU
        {
            get { return SKU?.ToUpperInvariant(); }
            set { }
        }

        [MaxLength(2048)]
        public string Description { get; set; }

        public decimal? SalesPriceOrRate { get; set; }

        public Guid? RevenueAccountId { get; set; }
        public Account RevenueAccount { get; private set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; private set; }

        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; private set; }
    }
}
