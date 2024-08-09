using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DashAccountingSystemV2.BackEnd.ViewModels.Serialization;

namespace DashAccountingSystemV2.BackEnd.ViewModels
{
    public class PostJournalEntryRequestViewModel
    {
        [DataType(DataType.Date)]
        [Required]
        [JsonConverter(typeof(JsonDateConverter))]
        public DateTime PostDate { get; set; }

        public string Note { get; set; }
    }
}
