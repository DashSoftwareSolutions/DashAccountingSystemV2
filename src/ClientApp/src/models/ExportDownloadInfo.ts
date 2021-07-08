import ExportFormat from './ExportFormat';

export default interface ExportDownloadInfo {
    format: ExportFormat;
    fileName: string;
    token: string;
}