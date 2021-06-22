using System;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class JournalEntryAccountResponseViewModel
    {
        public Guid AccountId { get; set; }

        public uint AccountNumber { get; set; }

        public string AccountName { get; set; }

        public AmountViewModel Amount { get; set; }

        public static JournalEntryAccountResponseViewModel FromModel(JournalEntryAccount journalEntryAccount)
        {
            if (journalEntryAccount == null)
                return null;

            return new JournalEntryAccountResponseViewModel()
            {
                AccountId = journalEntryAccount.AccountId,
                AccountName = journalEntryAccount.Account.Name,
                AccountNumber = journalEntryAccount.Account.AccountNumber,
                Amount = new AmountViewModel(journalEntryAccount.Amount, journalEntryAccount.AssetType),
            };
        }
    }
}
