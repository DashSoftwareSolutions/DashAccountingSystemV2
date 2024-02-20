using System.ComponentModel.DataAnnotations;

namespace DashAccountingSystemV2.Models
{
    public class JournalEntryAccount : IEquatable<JournalEntryAccount>
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
        public ReconciliationReport? ReconciliationReport { get; set; }

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

        public JournalEntryAccount Clone()
        {
            return (JournalEntryAccount)MemberwiseClone();
        }

        public bool Equals(JournalEntryAccount? other)
        {
            if (other == null)
                return false;

            return JournalEntryId == other.JournalEntryId &&
                AccountId == other.AccountId;
        }

        public override bool Equals(object? obj)
        {
            if (obj is JournalEntryAccount other)
                return Equals(other);

            return false;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hash = 17;
                hash = hash * 23 + JournalEntryId.GetHashCode();
                hash = hash * 23 + AccountId.GetHashCode();
                return hash;
            };
        }
    }
}
