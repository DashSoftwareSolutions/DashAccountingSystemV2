using System;
using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class InvoicePaymentCreateRequestViewModel
    {
        [Required(ErrorMessage = "Invoice ID is required.")]
        public Guid InvoiceId { get; set; }

        [Required(ErrorMessage = "Amount is required.")]
        public AmountViewModel PaymentAmount { get; set; }

        public static InvoicePayment ToModel(InvoicePaymentCreateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return null;

            return new InvoicePayment()
            {
                InvoiceId = viewModel.InvoiceId,
                Amount = viewModel.PaymentAmount?.Amount ?? 0.0m,
            };
        }
    }
}
