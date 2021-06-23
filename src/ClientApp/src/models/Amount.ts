import AmountType from './AmountType';
import AssetType from './AssetType';

export default interface Amount {
    amount: number | null;
    assetType: AssetType | null;
    amountType: AmountType | null; // "Debit" or "Credit"
}