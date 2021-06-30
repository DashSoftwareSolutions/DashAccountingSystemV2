using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using DashAccountingSystemV2.ViewModels.Serialization;

namespace DashAccountingSystemV2.ViewModels
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
