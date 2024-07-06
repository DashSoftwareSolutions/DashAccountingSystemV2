using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.BackEnd.Extensions;

namespace DashAccountingSystemV2.BackEnd.Models
{
    public enum KnownAccountType
    {
        [Display(Name = "Unknown")]
        Unknown = 0,

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

    public static class KnownAccountTypeExtensions
    {
        public static string GetDisplayName(this KnownAccountType accountType)
        {
            return EnumerationExtensions.GetDisplayName(accountType);
        }
    }
}
