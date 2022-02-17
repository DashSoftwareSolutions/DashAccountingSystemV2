using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Tenant
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public Guid Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(255)]
        public string Name { get; private set; }

        [Required]
        public int DefaultAssetTypeId { get; set; }
        public AssetType DefaultAssetType { get; set; }

        // Navigation Properties
        public ICollection<Account> Accounts { get; } = new List<Account>();
        public ICollection<JournalEntry> JournalEntries { get; } = new List<JournalEntry>();

        public Tenant() { }

        public Tenant(string name)
        {
            Name = name;
        }

        public Tenant(Guid id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
