using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class TimeActivityResponseViewModel
    {
        public Guid Id { get; set; }

        public Guid TenantId { get; set; }

        public Guid CustomerId { get; set; }

        public CustomerLiteResponseViewModel Customer { get; set; }

        public Guid EmployeeId { get; set; }

        public EmployeeLiteResponseViewModel Employee { get; set; }

        public Guid ProductId { get; set; }

        public ProductLiteResponseViewModel Product { get; set; }

        public bool IsBillable { get; set; }

        public decimal? HourlyBillingRate { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime Date { get; set; }

        public string TimeZone { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public TimeSpan? Break { get; set; }

        public string Description { get; set; }

        public TimeSpan TotalTime { get; set; }

        public decimal TotalBillableAmount { get; set; }

        public static TimeActivityResponseViewModel FromModel(TimeActivity timeActivity)
        {
            if (timeActivity == null)
                return null;

            return new TimeActivityResponseViewModel()
            {
                Id = timeActivity.Id,
                TenantId = timeActivity.TenantId,
                CustomerId = timeActivity.CustomerId,
                Customer = CustomerLiteResponseViewModel.FromModel(timeActivity.Customer),
                EmployeeId = timeActivity.EmployeeId,
                Employee = EmployeeLiteResponseViewModel.FromModel(timeActivity.Employee),
                ProductId = timeActivity.ProductId,
                Product = ProductLiteResponseViewModel.FromModel(timeActivity.ProductOrService),
                IsBillable = timeActivity.IsBillable,
                HourlyBillingRate = timeActivity.HourlyBillingRate,
                Date = timeActivity.Date,
                TimeZone = timeActivity.TimeZone,
                StartTime = timeActivity.StartTime,
                EndTime = timeActivity.EndTime,
                Break = timeActivity.Break,
                Description = timeActivity.Description,
                TotalTime = timeActivity.TotalTime,
                TotalBillableAmount = timeActivity.TotalBillableAmount,
            };
        }
    }
}
