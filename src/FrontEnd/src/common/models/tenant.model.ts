import AssetType from './assetType.model';

export default interface Tenant {
    id: string; // GUID
    name: string;
    defaultAssetType: AssetType;
}
