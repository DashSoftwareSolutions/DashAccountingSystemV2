import Address from './Address';

export default interface Customer {
    id: string; // GUID
    customerNumber: string; // short, unique alpha-numeric ID number for the customer
    companyName: string;
    displayName: string;
    contactPersonTitle: string | null;
    contactPersonFirstName: string;
    contactPersonMiddleName: string | null;
    contactPersonLastName: string;
    contactPersonNickName: string | null;
    contactPersonSuffix: string | null;
    email: string | null;
    workPhoneNumber: string | null;
    mobilePhoneNumber: string | null;
    faxNumber: string | null;
    otherPhoneNumber: string | null;
    website: string | null;
    isShippingAddressSameAsBillingAddress: boolean;
    billingAddress: Address;
    shippingAddress: Address | null;
    notes: string | null;
}