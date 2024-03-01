using System.Text.Json.Serialization;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
{
    public class LedgerAccountTransactionResponseViewModel
    {
        /// <summary>
        /// Journal Entry Primary Key
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Journal Entry visible sequential number
        /// </summary>
        public uint EntryId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<TransactionStatus>))]
        public TransactionStatus Status { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime EntryDate { get; set; }

        [JsonConverter(typeof(JsonNullableDateConverter))]
        public DateTime? PostDate { get; set; }

        public string Description { get; set; }

        public string Note { get; set; }

        public uint? CheckNumber { get; set; }

        public DateTime Created { get; set; }

        public DateTime? Updated { get; set; }

        public AmountViewModel Amount { get; set; }

        public AmountViewModel UpdatedBalance { get; set; }

        public static LedgerAccountTransactionResponseViewModel FromModel(JournalEntryAccount journalEntryAccount)
        {
            if (journalEntryAccount == null ||
                journalEntryAccount.JournalEntry == null)
                return null;

            return new LedgerAccountTransactionResponseViewModel()
            {
                Id = journalEntryAccount.JournalEntry.Id,
                EntryId = journalEntryAccount.JournalEntry.EntryId,
                Status = journalEntryAccount.JournalEntry.Status,
                EntryDate = journalEntryAccount.JournalEntry.EntryDate,
                PostDate = journalEntryAccount.JournalEntry.PostDate,
                Description = journalEntryAccount.JournalEntry.Description,
                Note = journalEntryAccount.JournalEntry.Note,
                CheckNumber = journalEntryAccount.JournalEntry.CheckNumber,
                Created = journalEntryAccount.JournalEntry.Created.AsUtc(),
                Updated = journalEntryAccount.JournalEntry.Updated.AsUtc(),
                Amount = new AmountViewModel(journalEntryAccount.Amount, journalEntryAccount.AssetType),
            };
        }
    }
}
