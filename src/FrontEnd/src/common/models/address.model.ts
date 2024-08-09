import AddressType from './addressType.model';
import Country from './country.model';
import Region from './region.model';

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
