using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public class PaymentMethod
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(256)]
        public string Name { get; set; }

        public PaymentMethod(string name)
        {
            Name = name;
        }
    }
}
