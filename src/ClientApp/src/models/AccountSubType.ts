import LookupValue from './LookupValue';

export default interface AccountSubType extends LookupValue {
    accountTypeId: number;
    accountType: string;
}