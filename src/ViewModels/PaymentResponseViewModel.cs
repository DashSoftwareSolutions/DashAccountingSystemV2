using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
{
    public class PaymentResponseViewModel
    {
        public Guid Id { get; set; }

        public Guid TenantId { get; set; }

        public Guid CustomerId { get; set; }

        public CustomerLiteResponseViewModel Customer { get; set; }

        public Guid DepositAccountId { get; set; }

        public AccountLiteResponseViewModel DepositAccount { get; set; }

        public Guid RevenueAccountId { get; set; }

        public AccountLiteResponseViewModel RevenueAccount { get; set; }

        public int PaymentMethodId { get; set; }

        public LookupValueViewModel PaymentMethod { get; set; }

        public uint? CheckNumber { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime PaymentDate { get; set; }

        public AmountViewModel Amount { get; set; }

        public Guid JournalEntryId { get; set; }

        public JournalEntryLiteResponseViewModel JournalEntry { get; set; }

        public string Description => JournalEntry?.Description;

        public bool IsPosted => JournalEntry?.Status == TransactionStatus.Posted;

        public IEnumerable<InvoicePaymentResponseViewModel> Invoices { get; set; }

        [JsonConverter(typeof(JsonIsoDateTimeConverter))]
        public DateTime Created { get; set; }

        public ApplicationUserLiteViewModel CreatedBy { get; set; }

        [JsonConverter(typeof(JsonIsoDateTimeConverter))]
        public DateTime? Updated { get; set; }

        public ApplicationUserLiteViewModel UpdatedBy { get; set; }

        public static PaymentResponseViewModel FromModel(Payment model)
        {
            if (model == null)
                return null;

            return new PaymentResponseViewModel()
            {
                Id = model.Id,
                TenantId = model.TenantId,
                CustomerId = model.CustomerId,
                Customer = CustomerLiteResponseViewModel.FromModel(model.Customer),
                DepositAccountId = model.DepositAccountId,
                DepositAccount = AccountLiteResponseViewModel.FromModel(model.DepositAccount),
                RevenueAccountId = model.RevenueAccountId,
                RevenueAccount = AccountLiteResponseViewModel.FromModel(model.RevenueAccount),
                PaymentMethodId = model.PaymentMethodId,
                PaymentMethod = model.PaymentMethod != null ?
                    new LookupValueViewModel(model.PaymentMethod.Id, model.PaymentMethod.Name) :
                    null,
                CheckNumber = model.CheckNumber,
                PaymentDate = model.Date,
                Amount = new AmountViewModel(model.Amount, model.AssetType),
                JournalEntryId = model.JournalEntryId,
                JournalEntry = JournalEntryLiteResponseViewModel.FromModel(model.JournalEntry),
                Invoices = model.Invoices.Select(i => InvoicePaymentResponseViewModel.FromModel(i, model.AssetType)),
                Created = model.Created.AsUtc(),
                CreatedBy = ApplicationUserLiteViewModel.FromModel(model.CreatedBy),
                Updated = model.Updated.AsUtc(),
                UpdatedBy = ApplicationUserLiteViewModel.FromModel(model.UpdatedBy),
            };
        }
    }
}
