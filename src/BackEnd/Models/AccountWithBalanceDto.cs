﻿namespace DashAccountingSystemV2.BackEnd.Models
{
    public class AccountWithBalanceDto
    {
        public Account Account { get; set; }

        public decimal CurrentBalance { get; set; }
    }
}
