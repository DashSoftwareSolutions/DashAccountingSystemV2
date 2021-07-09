import AssetType from './AssetType';

export default interface Tenant {
    id: string; // GUID
    name: string;
    defaultAssetType: AssetType;
}