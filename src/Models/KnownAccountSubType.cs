using System.ComponentModel.DataAnnotations;
using DashAccountingSystemV2.Extensions;

namespace DashAccountingSystemV2.Models
{
    public enum KnownAccountSubType
    {
        // ASSETS

        [Display(Name = "Bank Account")]
        BanAccount = 1,

        [Display(Name = "Accounts Receivable (A/R)")]
        AccountsReceivable = 2,

        [Display(Name = "Other Current Assets")]
        OtherCurrentAssets = 3,

        [Display(Name = "Fixed Assets")]
        FixedAssets = 4,

        [Display(Name = "Other Assets")]
        OtherAssets = 5,

        // LIABILITIES

        [Display(Name = "Accounts Payable (A/P)")]
        AccountsPayable = 6,

        [Display(Name = "Credit Card")]
        CreditCard = 7,

        [Display(Name = "Other Current Liabilities")]
        OtherCurrentLiabilities = 8,

        [Display(Name = "Long Term Liabilities")]
        LongTermLiabilities = 9,

        // EQUITY

        [Display(Name = "Equity")]
        Equity = 10,

        [Display(Name = "Retained Earnings")]
        RetainedEarnings = 11,

        // REVENUE

        [Display(Name = "Operating Revenue")]
        OperatingRevenue = 12,

        [Display(Name = "Other Income")]
        OtherIncome = 13,

        // EXPENSES

        [Display(Name = "Cost of Goods Sold")]
        CostOfGoodsSold = 14,

        [Display(Name = "Operating Expense")]
        OperatingExpense = 15,

        [Display(Name = "Other Expense")]
        OtherExpense = 16,
    }

    public static class KnownAccountSubTypeExtensions
    {
        public static string GetDisplayName(this KnownAccountSubType accountSubType)
        {
            return EnumerationExtensions.GetDisplayName(accountSubType);
        }
    }
}
