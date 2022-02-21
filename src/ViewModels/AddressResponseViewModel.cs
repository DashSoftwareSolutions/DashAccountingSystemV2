﻿using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using DashAccountingSystemV2.Models;

namespace DashAccountingSystemV2.ViewModels
{
    public class AddressResponseViewModel
    {
        public Guid Id { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public AddressType AddressType { get; set; }

        public string StreetAddress1 { get; set; }

        public string StreetAddress2 { get; set; }

        public string City { get; set; }

        public RegionResponseViewModel Region { get; set; }

        public string PostalCode { get; set; }

        public CountryResponseViewModel Country { get; set; }

        public static AddressResponseViewModel FromModel(Address model)
        {
            if (model == null)
                return null;

            return new AddressResponseViewModel()
            {
                Id = model.Id,
                AddressType = model.AddressType,
                StreetAddress1 = model.StreetAddress1,
                StreetAddress2 = model.StreetAddress2,
                City = model.City,
                PostalCode = model.PostalCode,
                Region = RegionResponseViewModel.FromModel(model.Region),
                Country = CountryResponseViewModel.FromModel(model.Country),
            };
        }
    }
}
