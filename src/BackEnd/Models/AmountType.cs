using System.ComponentModel.DataAnnotations;

namespace DashAccountingSystemV2.Models
{
    public enum AmountType : sbyte
    {
        [Display(Name = "Debit")]
        Debit = 1,

        [Display(Name = "Credit")]
        Credit = -1
    }
}
