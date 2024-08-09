import Tenant from './tenant.model';
import UserLite from './userLite.model';

export default interface BootstrapInfo {
    applicationVersion: string;
    userInfo: UserLite;
    tenants: Tenant[];
}
