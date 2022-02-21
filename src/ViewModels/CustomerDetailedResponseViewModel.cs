using System;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class CustomerDetailedResponseViewModel
    {
        public Guid Id { get; set; }

        public string CustomerNumber { get; set; }

        public string CompanyName { get; set; }

        public string DisplayName { get; set; }

        public string ContactPersonTitle { get; set; }

        public string ContactPersonFirstName { get; set; }

        public string ContactPersonMiddleName { get; set; }

        public string ContactPersonLastName { get; set; }

        public string ContactPersonSuffix { get; set; }

        public string ContactPersonNickName { get; set; }

        public string Email { get; set; }

        public string WorkPhoneNumber { get; set; } // TODO: Add Lib Phone Number and use nicer PhoneNumberViewModel

        public string MobilePhoneNumber { get; set; } // TODO: Add Lib Phone Number and use nicer PhoneNumberViewModel

        public string FaxNumber { get; set; } // TODO: Add Lib Phone Number and use nicer PhoneNumberViewModel

        public string OtherPhoneNumber { get; set; } // TODO: Add Lib Phone Number and use nicer PhoneNumberViewModel

        public string Website { get; set; }

        public bool IsShippingAddressSameAsBillingAddress { get; set; }

        public AddressResponseViewModel BillingAddress { get; set; }

        public AddressResponseViewModel ShippingAddress { get; set; }

        public string Notes { get; set; }

        public static CustomerDetailedResponseViewModel FromModel(Customer customer)
        {
            if (customer == null)
                return null;

            return new CustomerDetailedResponseViewModel()
            {
                Id = customer.EntityId,
                CustomerNumber = customer.CustomerNumber,
                CompanyName = customer.CompanyName,
                DisplayName = customer.DisplayName,
                ContactPersonFirstName = customer.ContactPersonFirstName,
                ContactPersonLastName = customer.ContactPersonLastName,
                ContactPersonMiddleName = customer.ContactPersonMiddleName,
                ContactPersonNickName = customer.ContactPersonNickName,
                ContactPersonSuffix = customer.ContactPersonSuffix,
                ContactPersonTitle = customer.ContactPersonTitle,
                BillingAddress = AddressResponseViewModel.FromModel(customer.BillingAddress),
                ShippingAddress = AddressResponseViewModel.FromModel(customer.ShippingAddress),
                IsShippingAddressSameAsBillingAddress = customer.IsShippingAddressSameAsBillingAddress,
                Email = customer.Email,
                FaxNumber = customer.FaxNumber,
                MobilePhoneNumber = customer.MobilePhoneNumber,
                Notes = customer.Notes,
                OtherPhoneNumber = customer.OtherPhoneNumber,
                Website = customer.Website,
                WorkPhoneNumber = customer.WorkPhoneNumber,
            };
        }
    }
}
