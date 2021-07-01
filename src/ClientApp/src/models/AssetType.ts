import LookupValue from './LookupValue';

export default interface AssetType extends LookupValue {
    symbol: string | null;
}