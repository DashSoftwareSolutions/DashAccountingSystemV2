using System.ComponentModel.DataAnnotations;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class InvoicePayment
    {
        [Required]
        public Guid InvoiceId { get; set; }
        public Invoice Invoice { get; set; }

        [Required]
        public Guid PaymentId { get; set; }
        public Payment Payment { get; set; }

        /// <summary>
        /// Amount of the specified Payment that is applied to the specified Invoice.
        /// </summary>
        public decimal Amount { get; set; }
    }
}
