import {
    Amount,
    AmountType,
    AssetType,
} from './models';

export const DEFAULT_ASSET_TYPE: AssetType = { id: 1, name: 'USD', symbol: '$' };

export const DEFAULT_AMOUNT: Amount = {
    amount: 0,
    amountAsString: '0.00',
    amountType: AmountType.Debit,
    assetType: DEFAULT_ASSET_TYPE,
};

export const DEFAULT_INVOICE_TERMS: string = 'Net 30';

export const DEFAULT_SYSTEM_NOTIFICATION_ALERT_TIMEOUT: number = 4000;
