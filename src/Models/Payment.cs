using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; private set; }

        [Required]
        public Guid CustomerId { get; set; }
        public Customer Customer { get; private set; }

        [Required]
        public Guid DepositAccountId { get; set; }
        public Account DepositAccount { get; private set; }

        [Required]
        public Guid RevenueAccountId { get; set; }
        public Account RevenueAccount { get; private set; }

        [Required]
        public int PaymentMethodId { get; set; }
        public PaymentMethod PaymentMethod { get; private set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public int AssetTypeId { get; set; }
        public AssetType AssetType { get; private set; }

        [Required]
        public Guid JournalEntryId { get; set; }
        public JournalEntry JournalEntry { get; private set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; private set; }

        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; private set; }

        public ICollection<InvoicePayment> Invoices { get; set; }
    }
}
