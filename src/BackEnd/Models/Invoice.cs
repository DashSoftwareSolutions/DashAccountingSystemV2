using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; set; }

        [Required]
        public uint InvoiceNumber { get; set; }

        [Required]
        public InvoiceStatus Status { get; set; }

        [Required]
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }

        [EmailAddress]
        [MaxLength(256)]
        public string? CustomerEmail { get; set; }

        [MaxLength(2048)]
        public string? CustomerAddress { get; set; }

        [Required]
        public Guid InvoiceTermsId { get; set; }
        public InvoiceTerms InvoiceTerms { get; set; }

        [Required]
        [Column(TypeName = "TIMESTAMP")]
        public DateTime IssueDate { get; set; }

        [Required]
        [Column(TypeName = "TIMESTAMP")]
        public DateTime DueDate { get; set; }

        [MaxLength(2048)]
        public string? Message { get; set; }

        public ICollection<InvoiceLineItem> LineItems { get; set; } = new List<InvoiceLineItem>();

        private decimal? _total;

        [NotMapped]
        public decimal Total
        {
            get
            {
                return _total ?? LineItems?.Sum(li => li.Total) ?? 0.0m;
            }
            set
            {
                _total = value;
            }
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

        public ICollection<InvoicePayment> Payments { get; private set; }
    }
}
