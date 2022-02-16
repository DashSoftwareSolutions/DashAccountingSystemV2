using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; private set; }

        [Required]
        public uint InvoiceNumber { get; set; }

        [Required]
        public InvoiceStatus Status { get; set; }

        [Required]
        public Guid CustomerId { get; set; }
        public Customer Customer { get; private set; }

        [EmailAddress]
        [MaxLength(256)]
        public string CustomerEmail { get; set; }

        [MaxLength(2048)]
        public string CustomerAddress { get; set; }

        [Required]
        public Guid InvoiceTermsId { get; set; }
        public InvoiceTerms InvoiceTerms { get; private set; }

        [Required]
        public DateTime IssueDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [MaxLength(2048)]
        public string Message { get; set; }

        public ICollection<InvoiceLineItem> LineItems { get; set; } = new List<InvoiceLineItem>();

        public decimal Total
        {
            get
            {
                return LineItems?.Sum(li => li.Total) ?? 0.0m;
            }
        }

        public Guid? PaymentId { get; set; }
        public Payment Payment { get; private set; }

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
