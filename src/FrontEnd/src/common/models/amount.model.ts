import AmountType from './amountType.model';
import AssetType from './assetType.model';

export default interface Amount {
    amount: number | null;
    amountAsString?: string | null;
    assetType: AssetType | null;
    amountType: AmountType | null; // "Debit" or "Credit"
}