using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class InvoicePaymentResponseViewModel
    {
        public Guid InvoiceId { get; set; }

        public InvoiceLiteResponseViewModel Invoice { get; set; }

        public AmountViewModel PaymentAmount { get; set; }

        public static InvoicePaymentResponseViewModel FromModel(InvoicePayment model, AssetType paymentAssetType)
        {
            if (model == null || paymentAssetType == null)
                return null;

            return new InvoicePaymentResponseViewModel()
            {
                InvoiceId = model.InvoiceId,
                Invoice = InvoiceLiteResponseViewModel.FromModel(model.Invoice),
                PaymentAmount = new AmountViewModel(model.Amount, paymentAssetType),
            };
        }
    }
}
