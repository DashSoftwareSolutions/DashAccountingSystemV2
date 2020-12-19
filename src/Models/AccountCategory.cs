using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Models
{
    public enum AccountCategory
    {
        [Display(Name = "Balance Sheet")]
        BalanceSheet = 1,

        [Display(Name = "Profit & Loss")]
        ProfitAndLoss = 2
    }

    public static class AccountCategoryExtensions
    {
        public static string GetDisplayName(this AccountCategory accountCategory)
        {
            return EnumerationExtensions.GetDisplayName(accountCategory);
        }
    }
}
