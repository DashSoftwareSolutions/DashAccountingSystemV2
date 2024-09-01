import TimeActivity from './timeActivity.model';
import {
    AssetType,
    DateRange,
} from '../../../../common/models';

export default interface TimeActivityDetailsReport {
    reportDates: DateRange;
    defaultAssetType: AssetType;
    timeActivities: TimeActivity[];
}
