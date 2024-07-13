using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class CustomerLiteResponseViewModel
    {
        public Guid Id { get; set; }

        public string CustomerNumber { get; set; }

        public string CompanyName { get; set; }

        public string DisplayName { get; set; }

        public static CustomerLiteResponseViewModel FromModel(Customer customer)
        {
            if (customer == null)
                return null;

            return new CustomerLiteResponseViewModel()
            {
                Id = customer.EntityId,
                CustomerNumber = customer.CustomerNumber,
                CompanyName = customer.CompanyName,
                DisplayName = customer.DisplayName,
            };
        }
    }
}
