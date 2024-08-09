import ExportFormat from './exportDownloadInfo.model';

export default interface ExportDownloadInfo {
    format: ExportFormat;
    fileName: string;
    token: string;
}
