using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class PaymentFacade : IPaymentFacade
    {
        private readonly IJournalEntryBusinessLogic _journalEntryBusinessLogic;
        private readonly IInvoiceBusinessLogic _invoiceBusinessLogic;
        private readonly IPaymentBusinessLogic _paymentBusinessLogic;
        private readonly ILogger _logger;

        public PaymentFacade(
            IJournalEntryBusinessLogic journalEntryBusinessLogic,
            IInvoiceBusinessLogic invoiceBusinessLogic,
            IPaymentBusinessLogic paymentBusinessLogic,
            ILogger<PaymentFacade> logger)
        {
            _journalEntryBusinessLogic = journalEntryBusinessLogic;
            _invoiceBusinessLogic = invoiceBusinessLogic;
            _paymentBusinessLogic = paymentBusinessLogic;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<Payment>> CreatePayment(PaymentCreationRequestDto paymentCreationRequest)
        {
            if (paymentCreationRequest == null)
                throw new ArgumentNullException(nameof(paymentCreationRequest));

            if (!paymentCreationRequest.Invoices.HasAny())
                return new BusinessLogicResponse<Payment>(
                    ErrorType.RequestNotValid,
                    "Payment must include one or more Invoices to be paid.");

            if (paymentCreationRequest.Invoices.Any(ip => ip.Amount <= 0.0m))
                return new BusinessLogicResponse<Payment>(
                    ErrorType.RequestNotValid,
                    "Payment must specify a non-zero amount to be paid on each included Invoice.");

            var sumOfAmountsOnSpecifiedInvoices = paymentCreationRequest.Invoices.Sum(i => i.Amount);
            if (sumOfAmountsOnSpecifiedInvoices != paymentCreationRequest.Amount)
                return new BusinessLogicResponse<Payment>(
                    ErrorType.RequestNotValid,
                    string.Format(
                        "Payment total amount {0:C} does not match the sum of the amount(s) for the specified Invoice(s) ( {1:C} ).",
                        paymentCreationRequest.Amount,
                        sumOfAmountsOnSpecifiedInvoices));

            // TODO:
            // 1) Security: Verify authorization (Tenant access and permissions and such)
            // 2) Transactionality: This is a complex operation that involves the accounting Journal
            //    and possibly multiple Invoices.  Ideally all DB writes should occur in the same
            //    transaction, and if any part of the operation fails, everything should be rolled back.

            // Step 1: Fetch the Invoices involved in the Payment and do some validation
            var invoiceIdsToPay = paymentCreationRequest
                .Invoices
                .Select(i => i.InvoiceId);

            var invoicesToPayResponse = await _invoiceBusinessLogic.GetPagedFilteredInvoices(
                paymentCreationRequest.TenantId,
                dateRangeStart: null,
                dateRangeEnd: null,
                includeCustomers: null,
                includeInvoices: invoiceIdsToPay,
                Pagination.Default);

            if (!invoicesToPayResponse.IsSuccessful)
                return new BusinessLogicResponse<Payment>(invoicesToPayResponse);

            var invoicesToPay = invoicesToPayResponse.Data.Results;

            var missingInvoices = invoiceIdsToPay.Where(invId => !invoicesToPay.Any(i => i.Id == invId));
            if (missingInvoices.Any())
            {
                var missingInvoiceIds = string.Join(" ", missingInvoices);

                return new BusinessLogicResponse<Payment>(
                    ErrorType.RequestNotValid,
                    $"Invoice ID {missingInvoiceIds} could not be found.");
            }

            // Validate that none of the specified Invoices are in 'Draft' status.
            var draftInvoices = invoicesToPay.Where(i => i.Status == InvoiceStatus.Draft);
            if (draftInvoices.Any())
            {
                // TODO: l10n/i18n on error message, including handling singular/plural case and such.
                var invoiceNumbers = string.Join(" ", draftInvoices.Select(i => i.InvoiceNumber));
                var isOrAre = draftInvoices.Count() > 1 ? "are" : "is";

                return new BusinessLogicResponse<Payment>(
                    ErrorType.RequestNotValid,
                    $"Invoice # {invoiceNumbers} {isOrAre} in 'Draft' status.  Payment should be applied to Invoices in 'Sent' status only.");
            }

            // Validate that none of the specified Invoices are already in 'Paid' status.
            var alreadyPaidInvoices = invoicesToPay.Where(i => i.Status == InvoiceStatus.Paid);
            if (alreadyPaidInvoices.Any())
            {
                // TODO: l10n/i18n on error message, including handling singular/plural case and such.
                var invoiceNumbers = string.Join(" ", alreadyPaidInvoices.Select(i => i.InvoiceNumber));
                var alreadyPaidInvoicesCount = alreadyPaidInvoices.Count();
                var seemOrSeems = alreadyPaidInvoicesCount > 1 ? "seem" : "seems";

                return new BusinessLogicResponse<Payment>(
                    ErrorType.RequestNotValid,
                    $"Invoice # {invoiceNumbers} {seemOrSeems} to have already been paid.");
            }

            // Validate payment amounts versus invoice totals.
            // For Phase 1 MVP, all specified Invoices must be paid in full.
            // TODO: In the future, we may opt to support partial payment on invoices.  See https://github.com/DashSoftwareSolutions/DashAccountingSystemV2/issues/82.
            // In this case, as part of fetching the Invoice data, we'd also need to fetch any prior payments for the specififed Invoices.

            foreach (var invoiceToPay in invoicesToPay)
            {
                var specifiedPayment = paymentCreationRequest.Invoices.FirstOrDefault(i => i.InvoiceId == invoiceToPay.Id);

                if (specifiedPayment.Amount != invoiceToPay.Total)
                    return new BusinessLogicResponse<Payment>(
                        ErrorType.RequestNotValid,
                        string.Format(
                            "Payment amount {0:C} on Invoice # {1} does not equal the total amount {2:C}.  For now, all specified Invoices must be paid in full.  A partial payments feature may be introduced in a future release.",
                            specifiedPayment.Amount,
                            invoiceToPay.InvoiceNumber,
                            invoiceToPay.Total));
            }

            // Step 2: Build and save the Journal Entry
            var paymentJournalEntry = new JournalEntry(
                paymentCreationRequest.TenantId,
                paymentCreationRequest.PaymentDate,
                paymentCreationRequest.IsPosted ? paymentCreationRequest.PaymentDate : null,
                paymentCreationRequest.Description,
                paymentCreationRequest.CheckNumber,
                paymentCreationRequest.CreatedById,
                paymentCreationRequest.IsPosted ? paymentCreationRequest.CreatedById : null);

            paymentJournalEntry.Accounts = new JournalEntryAccount[]
            {
                new JournalEntryAccount(paymentCreationRequest.DepositAccountId, paymentCreationRequest.Amount, paymentCreationRequest.AssetTypeId),
                new JournalEntryAccount(paymentCreationRequest.RevenueAccountId, -paymentCreationRequest.Amount, paymentCreationRequest.AssetTypeId),
            };

            var saveJournalEntryResponse = await _journalEntryBusinessLogic.CreateJournalEntry(paymentJournalEntry);

            if (!saveJournalEntryResponse.IsSuccessful)
            {
                // TODO: When this operation is transactional (i.e. when we support cross-repository, cross-BLL transactions), rollback the transaction!

                return new BusinessLogicResponse<Payment>(saveJournalEntryResponse);
            }

            // Step 2: Mark the Invoice(s) paid
            foreach (var invoiceToPay in invoicesToPay)
            {
                var markInvoicePaidResponse = await _invoiceBusinessLogic.UpdateInvoiceStatus(invoiceToPay.Id, InvoiceStatus.Paid, paymentCreationRequest.CreatedById);

                if (!markInvoicePaidResponse.IsSuccessful)
                {
                    // TODO: When this operation is transactional (i.e. when we support cross-repository, cross-BLL transactions), rollback the transaction!

                    return new BusinessLogicResponse<Payment>(markInvoicePaidResponse);
                }
            }

            // Step 3: Build and save the Payment record
            var payment = new Payment()
            {
                TenantId = paymentCreationRequest.TenantId,
                CustomerId = paymentCreationRequest.CustomerId,
                DepositAccountId = paymentCreationRequest.DepositAccountId,
                RevenueAccountId = paymentCreationRequest.RevenueAccountId,
                PaymentMethodId = paymentCreationRequest.PaymentMethodId,
                Date = paymentCreationRequest.PaymentDate,
                Amount = paymentCreationRequest.Amount,
                AssetTypeId = paymentCreationRequest.AssetTypeId,
                CheckNumber = paymentCreationRequest.CheckNumber,
                JournalEntryId = saveJournalEntryResponse.Data.Id,
                CreatedById = paymentCreationRequest.CreatedById,
                Invoices = paymentCreationRequest.Invoices.AsArrayOrNull(),
            };

            var savedPaymentResponse = await _paymentBusinessLogic.CreatePayment(payment);

            if (!savedPaymentResponse.IsSuccessful)
            {
                // TODO: When this operation is transactional (i.e. when we support cross-repository, cross-BLL transactions), rollback the transaction!
            }

            return savedPaymentResponse;
        }
    }
}
