import AddressType from './AddressType';
import Country from './Country';
import Region from './Region';

export default interface Address {
    id: string; // GUID
    addressType: AddressType;
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    region: Region;
    postalCode: string;
    country: Country;
}