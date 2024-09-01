using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.BackEnd.Extensions;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class TimeActivityCreateRequestViewModel
    {
        [Required(AllowEmptyStrings = false)]
        public Guid TenantId { get; set; }

        [Required(AllowEmptyStrings = false)]
        public Guid EmployeeId { get; set; }

        [Required(AllowEmptyStrings = false)]
        public Guid CustomerId { get; set; }

        [Required(AllowEmptyStrings = false)]
        public Guid ProductId { get; set; }

        public bool IsBillable { get; set; }

        public decimal? HourlyBillingRate { get; set; }

        [DataType(DataType.Date)]
        [Required(AllowEmptyStrings = false)]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime Date { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string TimeZone { get; set; }

        [DataType(DataType.Time)]
        [Required(AllowEmptyStrings = false)]
        [RegularExpression(@"^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$", ErrorMessage = "Start Time does not appear to be a valid time of day")]
        public TimeSpan StartTime { get; set; }

        [DataType(DataType.Time)]
        [Required(AllowEmptyStrings = false)]
        [RegularExpression(@"^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$", ErrorMessage = "End Time does not appear to be a valid time of day")]
        public TimeSpan EndTime { get; set; }

        [DataType(DataType.Duration)]
        [RegularExpression(@"^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$", ErrorMessage = "Break does not appear to be a valid duration")]
        [JsonConverter(typeof(JsonNullableTimeSpanConverter))]
        public TimeSpan? Break { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(2048)]
        public string Description { get; set; }

        public static TimeActivity ToModel(TimeActivityCreateRequestViewModel viewModel)
        {
            if (viewModel == null)
                return null;

            return new TimeActivity()
            {
                TenantId = viewModel.TenantId,
                EmployeeId = viewModel.EmployeeId,
                CustomerId = viewModel.CustomerId,
                ProductId = viewModel.ProductId,
                IsBillable = viewModel.IsBillable,
                HourlyBillingRate = viewModel.HourlyBillingRate,
                Date = viewModel.Date,
                StartTime = viewModel.StartTime,
                EndTime = viewModel.EndTime,
                Break = viewModel.Break,
                TimeZone = viewModel.TimeZone,
                Description = viewModel.Description.Trim(),
            };
        }
    }
}
