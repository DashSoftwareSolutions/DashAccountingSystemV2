using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Models
{
    public enum AccountSubCategory
    {
        [Display(Name = "Assets")]
        Assets = 1,

        [Display(Name = "Liabilities")]
        Liabilities = 2,

        [Display(Name = "Owners Equity")]
        OwnersEquity = 3,

        [Display(Name = "Revenue")]
        Revenue = 4,

        [Display(Name = "Expenses")]
        Expenses = 5
    }

    public static class AccountSubCategoryExtensions
    {
        public static string GetDisplayName(this AccountSubCategory acctSubCategory)
        {
            return EnumerationExtensions.GetDisplayName(acctSubCategory);
        }
    }
}
