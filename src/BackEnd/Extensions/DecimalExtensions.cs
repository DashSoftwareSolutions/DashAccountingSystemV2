﻿using DashAccountingSystemV2.BackEnd.Models;

namespace DashAccountingSystemV2.BackEnd.Extensions
{
    public static class DecimalExtensions
    {
        public static decimal WithNormalBalanceType(this decimal amount, AmountType normalBalanceType)
        {
            switch (normalBalanceType)
            {
                case AmountType.Credit:
                    return amount * -1;

                case AmountType.Debit:
                default:
                    return amount;
            }
        }
    }
}
