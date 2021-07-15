using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;

namespace DashAccountingSystemV2.Models
{
    public class TimeActivity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; private set; }

        [Required]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; private set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public Guid EmployeeId { get; set; }
        public Employee Employee { get; set; }

        [Required]
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }

        [Required]
        public Guid ProductId { get; set; }
        public Product ProductOrService { get; set; }

        public bool IsBillable { get; set; }

        public decimal? HourlyBillingRate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        public TimeSpan? Break { get; set; }

        public string TimeZone { get; set; }

        private TimeSpan? _totalTime = null;
        private readonly object _totalTimeSyncLock = new object();

        [NotMapped]
        public TimeSpan TotalTime
        {
            get
            {
                if (_totalTime == null)
                {
                    lock (_totalTimeSyncLock)
                    {
                        if (_totalTime == null)
                        {
                            var timeZone = DateTimeZoneProviders.Tzdb.GetZoneOrNull(TimeZone)
                                ?? DateTimeZoneProviders.Tzdb.GetSystemDefault();

                            var startDateTime = LocalDateTime
                                .FromDateTime(Date.Add(StartTime))
                                .InZoneLeniently(timeZone);

                            var endDateTime = LocalDateTime
                                .FromDateTime(Date.Add(EndTime))
                                .InZoneLeniently(timeZone);

                            var difference = endDateTime - startDateTime;
                            var differenceWithBreak = difference - Duration.FromTimeSpan(Break ?? default(TimeSpan));

                            _totalTime = differenceWithBreak.ToTimeSpan();
                        }
                    }
                }

                return _totalTime ?? default;
            }

            set { }
        }

        private decimal? _totalBillableAmount = null;
        private object _totalBillableAmountSyncLock = new object();

        [NotMapped]
        public decimal TotalBillableAmount
        {
            get
            {
                if (_totalBillableAmount == null)
                {
                    lock (_totalBillableAmountSyncLock)
                    {
                        if (_totalBillableAmount == null)
                        {
                            _totalBillableAmount = (decimal)TotalTime.TotalHours * (HourlyBillingRate ?? 0.0m);
                        }
                    }
                }

                return _totalBillableAmount ?? 0.0m;
            }

            set { }
        }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(2048)]
        public string Description { get; set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; set; }

        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; set; }
    }
}
