using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.Repositories;

namespace DashAccountingSystemV2.BackEnd.BusinessLogic
{
    public class PaymentBusinessLogic : IPaymentBusinessLogic
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly ITenantRepository _tenantRepository;
        private readonly ILogger _logger;

        public PaymentBusinessLogic(
            IPaymentRepository paymentRepository,
            ITenantRepository tenantRepository,
            ILogger<PaymentBusinessLogic> logger)
        {
            _paymentRepository = paymentRepository;
            _tenantRepository = tenantRepository;
            _logger = logger;
        }

        public async Task<BusinessLogicResponse<Payment>> CreatePayment(Payment payment)
        {
            if (payment == null)
                throw new ArgumentNullException(nameof(payment));

            var tenant = await _tenantRepository.GetTenantAsync(payment.TenantId);

            if (tenant == null)
            {
                return new BusinessLogicResponse<Payment>(ErrorType.RequestNotValid, "Tenant not found");
            }

            // TODO: Check that user has access to this tenant and permission to create the requested payment

            try
            {
                var savedPayment = await _paymentRepository.InsertAsync(payment);
                return new BusinessLogicResponse<Payment>(savedPayment);
            }
            catch (Exception ex)
            {
                // TODO: More specific error handling -- distinguish between 400 Bad Request (or 409 Conflict if applicable) and true 500 Internal Server Error
                _logger.LogError(ex, "Error creating new Payment");
                return new BusinessLogicResponse<Payment>(ErrorType.RuntimeException, "Failed to create new Payment");
            }
        }
    }
}
