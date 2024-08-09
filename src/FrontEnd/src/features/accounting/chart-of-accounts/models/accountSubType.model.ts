import { LookupValue } from '../../../../common/models';

/**
 * Account Sub-Type Lookup Value
 */
export default interface AccountType extends LookupValue {
    accountTypeId: number;
    accountType: string;
}
