export default interface ProductLite {
    id: string; // GUID
    categoryId: string; // GUID
    category: string;
    type: string; // 'Product' or 'Service'
    sku: string | null;
    name: string;
    salesPriceOrRate: number;
}