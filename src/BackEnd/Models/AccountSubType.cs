using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class AccountSubType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(255)]
        public string Name { get; set; }

        public int AccountTypeId { get; private set; }
        public AccountType AccountType { get; set; }

        public AccountSubType(string name, int accountTypeId)
        {
            Name = name;
            AccountTypeId = accountTypeId;
        }
    }
}
