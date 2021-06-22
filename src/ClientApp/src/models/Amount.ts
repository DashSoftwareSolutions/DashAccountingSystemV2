import LookupValue from './LookupValue';

export default interface Amount {
    amount: number | null;
    assetType: LookupValue;
    amountType: string; // "Debit" or "Credit"
}