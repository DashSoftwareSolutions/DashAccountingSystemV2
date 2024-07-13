using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class PaymentCreateRequestViewModel
    {
        [Required(ErrorMessage = "Tenant ID is required.")]
        public Guid TenantId { get; set; }

        [Required(ErrorMessage = "Customer ID is required.")]
        public Guid CustomerId { get; set; }

        [Required(ErrorMessage = "Deposit Account ID is required.")]
        public Guid DepositAccountId { get; set; }

        [Required(ErrorMessage = "Revenue Account ID is required.")]
        public Guid RevenueAccountId { get; set; }

        [Required(ErrorMessage = "Payment Method ID is required.")]
        public int PaymentMethodId { get; set; }

        public uint? CheckNumber { get; set; }

        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Payment Date is required.")]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime PaymentDate { get; set; }

        [Required(ErrorMessage = "Amount is required.")]
        public AmountViewModel Amount { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Description is required.")]
        public string Description { get; set; }

        public bool IsPosted { get; set; }

        public IEnumerable<InvoicePaymentCreateRequestViewModel> Invoices { get; set; }

        public static PaymentCreationRequestDto ToModel(PaymentCreateRequestViewModel viewModel, Guid contextUserId)
        {
            if (viewModel == null)
                return null;

            return new PaymentCreationRequestDto()
            {
                TenantId = viewModel.TenantId,
                CustomerId = viewModel.CustomerId,
                CheckNumber = viewModel.CheckNumber,
                CreatedById = contextUserId,
                Amount = viewModel.Amount?.Amount ?? 0.0m,
                AssetTypeId = viewModel.Amount.AssetType?.Id ?? 0,
                DepositAccountId = viewModel.DepositAccountId,
                Description = viewModel.Description,
                PaymentDate = viewModel.PaymentDate,
                PaymentMethodId = viewModel.PaymentMethodId,
                RevenueAccountId = viewModel.RevenueAccountId,
                IsPosted = viewModel.IsPosted,
                Invoices = viewModel.Invoices?.Select(InvoicePaymentCreateRequestViewModel.ToModel),
            };
        }
    }
}
