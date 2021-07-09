using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Models
{
    public class JournalEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required]
        public Guid TenantId { get; private set; }
        public Tenant Tenant { get; private set; }

        [Required]
        public uint EntryId { get; set; }

        [Required]
        public DateTime EntryDate { get; set; }

        public DateTime? PostDate { get; set; }

        [Required]
        public TransactionStatus Status { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(2048)]
        public string Description { get; set; }

        public uint? CheckNumber { get; set; }

        public string Note { get; set; }

        public ICollection<JournalEntryAccount> Accounts { get; set; } = new List<JournalEntryAccount>();

        public bool IsBalanced
        {
            get
            {
                if (Accounts.IsEmpty())
                    return true;

                return Accounts.Aggregate(0.0m, (sum, nextAcct) => sum += nextAcct.Amount) == 0.0m;
            }
        }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; private set; }
        public ApplicationUser CreatedBy { get; private set; }

        public DateTime? Updated { get; set; }

        public Guid? UpdatedById { get; set; }
        public ApplicationUser UpdatedBy { get; private set; }

        public Guid? PostedById { get; set; }
        public ApplicationUser PostedBy { get; private set; }

        /// <summary>
        /// Construct a Journal Entry, explicitly specifying Entry ID
        /// </summary>
        public JournalEntry(
            Guid tenantId,
            uint entryId,
            DateTime entryDate,
            DateTime? postDate,
            string description,
            uint? checkNumber,
            Guid createdById,
            Guid? postedById)
            : this(tenantId, entryDate, postDate, description, checkNumber, createdById, postedById)
        {
            EntryId = entryId;
        }

        /// <summary>
        /// Construct a Journal Entry, without explicitly specifying Entry ID
        /// </summary>
        /// <remarks>
        /// The <see cref="Repositories.JournalEntryRepository"/> will auto-assign the next sequential
        /// Entry ID for the Joural Entry's specified Tenant when Creating (persisting) a new Journal Entry.
        /// </remarks>
        public JournalEntry(
            Guid tenantId,
            DateTime entryDate,
            DateTime? postDate,
            string description,
            uint? checkNumber,
            Guid createdById,
            Guid? postedById)
        {
            TenantId = tenantId;
            EntryDate = entryDate;
            PostDate = postDate;
            Description = description;
            CheckNumber = checkNumber;
            CreatedById = createdById;
            PostedById = postedById;
            Status = postDate.HasValue ? TransactionStatus.Posted : TransactionStatus.Pending;
        }

        public JournalEntry Clone()
        {
            var clone = (JournalEntry)MemberwiseClone();
            clone.Accounts = Accounts?.Select(a => a.Clone())?.ToList();
            return clone;
        }
    }
}
