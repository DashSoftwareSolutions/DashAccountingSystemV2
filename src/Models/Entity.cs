using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Entity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; private set; }

        [Required]
        public Guid TenantId { get; set; }

        [Required]
        public EntityType EntityType { get; set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; private set; }

        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; private set; }

        public DateTime? Inactivated { get; set; }

        public Guid? InactivatedById { get; set; }
        public ApplicationUser InactivatedBy { get; private set; }

        public bool IsActive => !Inactivated.HasValue;
    }
}
