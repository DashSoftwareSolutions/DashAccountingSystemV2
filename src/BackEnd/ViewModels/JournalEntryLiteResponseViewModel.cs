using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.Models;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class JournalEntryLiteResponseViewModel : INumberedJournalEntry
    {
        public Guid Id { get; set; }

        public uint EntryId { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter<TransactionStatus>))]
        public TransactionStatus Status { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime EntryDate { get; set; }

        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime? PostDate { get; set; }

        public string Description { get; set; }

        public static JournalEntryLiteResponseViewModel FromModel(JournalEntry model)
        {
            if (model == null)
                return null;

            return new JournalEntryLiteResponseViewModel()
            {
                Id = model.Id,
                EntryId = model.EntryId,
                EntryDate = model.EntryDate,
                Description = model.Description,
                PostDate = model.PostDate,
                Status = model.Status,
            };
        }
    }
}
