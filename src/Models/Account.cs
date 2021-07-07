using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Account
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required]
        public Guid TenantId { get; private set; }
        public Tenant Tenant { get; private set; }

        [Required]
        public ushort AccountNumber { get; private set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; private set; }

        public string DisplayName => $"{AccountNumber} - {Name}";

        public string Description { get; set; }

        [Required]
        public int AccountTypeId { get; private set; }
        public AccountType AccountType { get; private set; }

        [Required]
        public int AccountSubTypeId { get; set; }
        public AccountSubType AccountSubType { get; set; }

        [Required]
        public int AssetTypeId { get; private set; }
        public AssetType AssetType { get; private set; }

        [Required]
        public AmountType NormalBalanceType { get; private set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; private set; }
        public ApplicationUser CreatedBy { get; private set; }

        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; private set; }

        public ICollection<ReconciliationReport> ReconciliationReports { get; set; } = new List<ReconciliationReport>();

        public Account(
            Guid tenantId,
            ushort accountNumber,
            string name,
            string description,
            int accountTypeId,
            int accountSubTypeId,
            int assetTypeId,
            AmountType normalBalanceType,
            Guid createdById)
        {
            TenantId = tenantId;
            AccountNumber = accountNumber;
            Name = name;
            Description = description;
            AccountTypeId = accountTypeId;
            AccountSubTypeId = accountSubTypeId;
            AssetTypeId = assetTypeId;
            NormalBalanceType = normalBalanceType;
            CreatedById = createdById;
        }
    }
}
