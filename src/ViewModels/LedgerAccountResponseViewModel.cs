﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class LedgerAccountResponseViewModel
    {
        public Guid Id { get; set; }

        public ushort AccountNumber { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public LookupValueViewModel AccountType { get; set; }

        public LookupValueViewModel AssetType { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public AmountType NormalBalanceType { get; set; }

        public AmountViewModel StartingBalance { get; set; }

        public IEnumerable<LedgerAccountTransactionResponseViewModel> Transactions { get; set; }

        public static LedgerAccountResponseViewModel FromModel(LedgerReportAccountDto ledgerReportAccountDto)
        {
            if (ledgerReportAccountDto == null)
                return null;

            return new LedgerAccountResponseViewModel()
            {
                Id = ledgerReportAccountDto.Account.Id,
                AccountNumber = ledgerReportAccountDto.Account.AccountNumber,
                Name = ledgerReportAccountDto.Account.Name,
                Description = ledgerReportAccountDto.Account.Description,
                AccountType = new LookupValueViewModel(ledgerReportAccountDto.Account.AccountType.Id, ledgerReportAccountDto.Account.AccountType.Name),
                AssetType = new LookupValueViewModel(ledgerReportAccountDto.Account.AssetType.Id, ledgerReportAccountDto.Account.AssetType.Name),
                NormalBalanceType = ledgerReportAccountDto.Account.NormalBalanceType,
                StartingBalance = new AmountViewModel(ledgerReportAccountDto.StartingBalance, ledgerReportAccountDto.Account.AssetType),
                Transactions = ledgerReportAccountDto
                    .Transactions
                    .Select(LedgerAccountTransactionResponseViewModel.FromModel),
            };
        }
    }
}
