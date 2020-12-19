﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Models
{
    public class ReconciliationReport
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required]
        public Guid AccountId { get; private set; }
        public Account Account { get; private set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; private set; }

        [Required]
        public Guid CreatedById { get; private set; }
        public ApplicationUser CreatedBy { get; private set; }

        [Required]
        public DateTime ClosingDate { get; set; }

        [Required]
        public decimal ClosingBalance { get; set; }

        public ICollection<JournalEntryAccount> Transactions { get; set; } = new List<JournalEntryAccount>();

        public decimal ReconciledBalance => Transactions.HasAny() ?
            Transactions.Aggregate(0.0m, (sum, nextTx) => sum += nextTx.Amount) :
            0.0m;
    }
}
