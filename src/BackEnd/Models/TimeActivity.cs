﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class TimeActivity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; private set; }

        [Required]
        [Column(TypeName = "TIMESTAMP")]
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

        [Required(AllowEmptyStrings = false)]
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
                            var differenceWithBreak = difference - Duration.FromTimeSpan(Break ?? default);

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
        [Column(TypeName = "TIMESTAMP")]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; set; }

        [Column(TypeName = "TIMESTAMP")]
        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; set; }

        /// <summary>
        /// EF Navigation property to the many-to-many intersection between Time Activities and Invoice Line Items.
        /// While implemented as a many-to-many, each key field individuall is also contrained to be unique, so that
        /// this functions as a non-mandatory one-to-one.
        /// </summary>
        public ICollection<InvoiceLineItemTimeActivity> InvoiceLineItems { get; set; }

        /// <summary>
        /// Gets the ID of the single corresponding Invoice Line Item, if any
        /// </summary>
        public Guid? InvoiceLineItemId => InvoiceLineItems.SingleOrDefault()?.InvoiceLineItemId;

        /// <summary>
        /// Navigation property to the single corresponding Invoice Line Item, if any
        /// </summary>
        public InvoiceLineItem InvoiceLineItem => InvoiceLineItems.SingleOrDefault()?.InvoiceLineItem;

        public TimeActivity() { }

        public TimeActivity(TimeActivity source)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            Id = source.Id;
            TenantId = source.TenantId;
            Tenant = source.Tenant;
            CustomerId = source.CustomerId;
            Customer = source.Customer;
            EmployeeId = source.EmployeeId;
            Employee = source.Employee;
            ProductId = source.ProductId;
            ProductOrService = source.ProductOrService;
            Date = source.Date;
            StartTime = source.StartTime;
            EndTime = source.EndTime;
            Break = source.Break;
            TimeZone = source.TimeZone;
            Description = source.Description;
            IsBillable = source.IsBillable;
            HourlyBillingRate = source.HourlyBillingRate;
            Created = source.Created;
            CreatedBy = source.CreatedBy;
            CreatedById = source.CreatedById;
            Updated = source.Updated;
            UpdatedBy = source.UpdatedBy;
            UpdatedById = source.UpdatedById;
        }
    }
}
