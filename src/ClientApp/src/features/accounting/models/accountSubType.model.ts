import { LookupValue } from '../../../common/models';

export default interface AccountSubType extends LookupValue {
    accountTypeId: number;
    accountType: string;
}