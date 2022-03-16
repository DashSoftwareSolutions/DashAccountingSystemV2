using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Models
{
    public class InvoiceLineItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        public Guid InvoiceId { get; set; }
        public Invoice Invoice { get; private set; }

        [Required]
        public ushort OrderNumber { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public Guid ProductId { get; set; }
        public Product ProductOrService { get; private set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        [Required]
        public decimal Total { get; set; }

        [Required]
        public int AssetTypeId { get; set; }
        public AssetType AssetType { get; private set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; private set; }

        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; private set; }

        /// <summary>
        /// EF Navigation property to the many-to-many intersection between Time Activities and Invoice Line Items.
        /// While implemented as a many-to-many, each key field individuall is also contrained to be unique, so that
        /// this functions as a non-mandatory one-to-one.
        /// </summary>
        public ICollection<InvoiceLineItemTimeActivity> TimeActivities { get; set; }

        /// <summary>
        /// Gets the ID of the single corresponding Time Activity, if any
        /// </summary>
        public Guid? TimeActivityId => TimeActivities?.SingleOrDefault()?.TimeActivityId;

        /// <summary>
        /// Navigation property to the single corresponding Time Activity, if any
        /// </summary>
        public TimeActivity TimeActivity => TimeActivities?.SingleOrDefault()?.TimeActivity;

        /// <summary>
        /// Gets a description of the Line Item for the PDF Invoice
        /// </summary>
        /// <returns></returns>
        public string GetBillableItemDescription()
        {
            if (TimeActivityId != null)
            {
                var timeActivityDuration = TimeSpan.FromHours((double)Quantity);

                return string.Format("{0}, {1} @ {2:C}/hr", Description, timeActivityDuration.HumanizeHoursAndMinutes(), UnitPrice);
            }

            // TODO: Handle any other special cases as desired besides Time Activities

            return Description;
        }
    }
}
