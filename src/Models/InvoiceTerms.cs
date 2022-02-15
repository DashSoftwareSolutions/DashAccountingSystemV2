using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class InvoiceTerms
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; private set; }

        public Guid? TenantId { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(256)]
        public string Name { get; set; }

        public ushort? DueInDays { get; set; }

        public ushort? DueOnDayOfMonth { get; set; }

        public ushort? DueNextMonthThreshold { get; set; }

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
