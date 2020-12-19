using System;
using System.ComponentModel.DataAnnotations;

namespace DashAccountingSystemV2.Models
{
    public class JournalEntryAccount
    {
        [Required]
        public Guid JournalEntryId { get; private set; }
        public JournalEntry JournalEntry { get; private set; }

        [Required]
        public Guid AccountId { get; private set; }
        public Account Account { get; private set; }

        [Required]
        public int AssetTypeId { get; private set; }
        public AssetType AssetType { get; private set; }

        [Required]
        public decimal Amount { get; set; }

        public Guid? ReconciliationReportId { get; set; }
        public ReconciliationReport ReconciliationReport { get; set; }

        public bool Reconciled => ReconciliationReportId.HasValue;

        public AmountType AmountType
        {
            get { return Amount >= 0.0m ? AmountType.Debit : AmountType.Credit; }
        }

        public JournalEntryAccount(Guid accountId, decimal amount, int assetTypeId)
        {
            AccountId = accountId;
            Amount = amount;
            AssetTypeId = assetTypeId;
        }

        public JournalEntryAccount(Guid journalEntryId, Guid accountId, decimal amount, int assetTypeId)
            : this(accountId, amount, assetTypeId)
        {
            JournalEntryId = journalEntryId;
        }
    }
}
