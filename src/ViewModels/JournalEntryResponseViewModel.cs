using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Extensions;
using DashAccountingSystemV2.Models;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
{
    public class JournalEntryResponseViewModel : INumberedJournalEntry
    {
        public Guid TenantId { get; set; }

        public Guid Id { get; set; }

        public uint EntryId { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public TransactionStatus Status { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime EntryDate { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime? PostDate { get; set; }

        public string Description { get; set; }

        public string Note { get; set; }

        public uint? CheckNumber { get; set; }

        [JsonConverter(typeof(JsonIsoDateTimeConverter))]
        public DateTime Created { get; set; }

        [JsonConverter(typeof(JsonIsoDateTimeConverter))]
        public DateTime? Updated { get; set; }

        [JsonConverter(typeof(JsonIsoDateTimeConverter))]
        public DateTime? Cancelled { get; set; }

        // TODO: Additional properties if needed
        //       Audit User metadata (for CreatedBy / UpdatedBy / EnteredBy / PostedBy / CanceledBy )

        public IEnumerable<JournalEntryAccountResponseViewModel> Accounts { get; set; }

        public static JournalEntryResponseViewModel FromModel(JournalEntry journalEntry)
        {
            if (journalEntry == null)
                return null;

            return new JournalEntryResponseViewModel()
            {
                TenantId = journalEntry.TenantId,
                Id = journalEntry.Id,
                EntryId = journalEntry.EntryId,
                Status = journalEntry.Status,
                EntryDate = journalEntry.EntryDate,
                PostDate = journalEntry.PostDate,
                Description = journalEntry.Description,
                Note = journalEntry.Note,
                CheckNumber = journalEntry.CheckNumber,
                Created = journalEntry.Created.AsUtc(),
                Updated = journalEntry.Updated.AsUtc(),
                Cancelled = journalEntry.CancelDate.AsUtc(),
                Accounts = journalEntry.Accounts.Select(JournalEntryAccountResponseViewModel.FromModel),
            };
        }
    }
}
