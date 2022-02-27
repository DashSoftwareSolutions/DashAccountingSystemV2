using System;
using System.Collections.Generic;

namespace DashAccountingSystemV2.Models
{
    public class PaymentCreationRequestDto
    {
        public Guid TenantId { get; set; }

        public Guid CustomerId { get; set; }

        public Guid DepositAccountId { get; set; }

        public Guid RevenueAccountId { get; set; }

        public int PaymentMethodId { get; set; }

        public uint? CheckNumber { get; set; }

        public DateTime PaymentDate { get; set; }

        public decimal Amount { get; set; }

        public int AssetTypeId { get; set; }

        public string Description { get; set; }

        public bool IsPosted { get; set; }

        public Guid CreatedById { get; set; }

        public IEnumerable<InvoicePayment> Invoices { get; set; }
    }
}
