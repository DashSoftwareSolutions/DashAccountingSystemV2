using System;
using System.ComponentModel.DataAnnotations;

namespace DashAccountingSystemV2.Models
{
    public class InvoiceLineItemTimeActivity
    {
        [Required]
        public Guid InvoiceLineItemId { get; set; }
        public InvoiceLineItem InvoiceLineItem { get; set; }

        [Required]
        public Guid TimeActivityId { get; set; }
        public TimeActivity TimeActivity { get; set; }
    }
}
