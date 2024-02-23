import LookupValue from './lookupValue.model';

export default interface AssetType extends LookupValue {
    symbol: string | null;
    description?: string;
}