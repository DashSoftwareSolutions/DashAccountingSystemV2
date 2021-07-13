using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashAccountingSystemV2.Models
{
    public class Customer
    {
        #region Entity ID and Tenant ID
        [Key]
        [ForeignKey("Entity")]
        [Required]
        public Guid EntityId { get; set; }
        public Entity Entity { get; set; }

        public Guid TenantId { get; set; }
        public Tenant Tenant { get; set; }
        #endregion Entity ID and Tenant ID

        [Required(AllowEmptyStrings = false)]
        [MaxLength(32)]
        public string CustomerNumber { get; set; }

        /// <summary>
        /// For unique index on Customer Number
        /// </summary>
        /// <remarks>
        /// EF is LAME and cannot allow UPPER() or LOWER() in index expression
        /// </remarks>
        public string NormalizedCustomerNumber
        {
            get { return CustomerNumber?.ToUpperInvariant(); }
            set { }
        }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(256)]
        public string CompanyName { get; set; }

        /// <summary>
        /// For unique index on Company Name
        /// </summary>
        /// <remarks>
        /// EF is LAME and cannot allow UPPER() or LOWER() in index expression
        /// </remarks>
        public string NormalizedCompanyName
        {
            get { return CompanyName?.ToUpperInvariant(); }
            set { }
        }

        [Required]
        [MaxLength(256)]
        public string DisplayName { get; set; }

        #region Contact Person Properties
        [MaxLength(10)]
        public string ContactPersonTitle { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(100)]
        public string ContactPersonFirstName { get; set; }

        [MaxLength(100)]
        public string ContactPersonMiddleName { get; set; }

        [Required(AllowEmptyStrings = false)]
        [MaxLength(100)]
        public string ContactPersonLastName { get; set; }

        [MaxLength(100)]
        public string ContactPersonNickName { get; set; }

        [MaxLength(10)]
        public string ContactPersonSuffix { get; set; }
        #endregion Person Properties

        public Guid BillingAddressId { get; set; }
        public Address BillingAddress { get; set; }

        public Guid? ShippingAddressId { get; set; }

        public Address ShippingAddress { get; set; }

        public bool IsShippingAddressSameAsBillingAddress { get; set; }

        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [Phone]
        [MaxLength(32)]
        public string WorkPhoneNumber { get; set; }

        [Phone]
        [MaxLength(32)]
        public string MobilePhoneNumber { get; set; }

        [Phone]
        [MaxLength(32)]
        public string FaxNumber { get; set; }

        [Phone]
        [MaxLength(32)]
        public string OtherPhoneNumber { get; set; }

        [Url]
        [MaxLength(2048)]
        public string Website { get; set; }

        public string Notes { get; set; }
    }
}
