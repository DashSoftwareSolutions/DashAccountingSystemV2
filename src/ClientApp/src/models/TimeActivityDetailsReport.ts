import AssetType from './AssetType';
import TimeActivity from './TimeActivity';

export default interface TimeActivityDetailsReport {
    reportDates: {
        dateRnageStart: string,
        dateRangeEnd: string,
    },
    defaultAssetType: AssetType,
    timeActivities: TimeActivity[],
}