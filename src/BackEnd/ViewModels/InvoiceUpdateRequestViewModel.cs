using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class InvoiceUpdateRequestViewModel : InvoiceCreateRequestViewModel
    {
        [Required(ErrorMessage = "Invoice ID is required.")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Invoice Number is required.")]
        public uint InvoiceNumber { get; set; }

        public static Invoice ToModel(InvoiceUpdateRequestViewModel viewModel, Guid contextUserId)
        {
            if (viewModel == null)
                return null;

            var result = InvoiceCreateRequestViewModel.ToModel(viewModel, contextUserId);
            result.Id = viewModel.Id;
            result.InvoiceNumber = viewModel.InvoiceNumber;

            return result;
        }
    }
}
