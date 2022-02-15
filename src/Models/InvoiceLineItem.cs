using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class InvoiceLineItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        public Guid InvoiceId { get; set; }
        public Invoice Invoice { get; private set; }

        [Required]
        public ushort OrderNumber { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public Guid ProductId { get; set; }
        public Product ProductOrService { get; private set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        [Required]
        public decimal Total { get; set; }

        [Required]
        public int AssetTypeId { get; set; }
        public AssetType AssetType { get; private set; }

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
