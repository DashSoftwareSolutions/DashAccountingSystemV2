using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.BackEnd.Models
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

        [EmailAddress]
        [MaxLength(256)]
        public string? ContactEmailAddress { get; set; }

        [NotMapped]
        public Address MailingAddress { get; set; }

        #region Navigation Properties
        public ICollection<Account> Accounts { get; } = new List<Account>();

        public ICollection<JournalEntry> JournalEntries { get; } = new List<JournalEntry>();
        #endregion Navigation Properties

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
