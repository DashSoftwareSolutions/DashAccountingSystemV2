export default interface ILogger {
    trace(format: string, ...args: unknown[]): void;
    debug(format: string, ...args: unknown[]): void;
    info(format: string, ...args: unknown[]): void;
    warn(format: string, ...args: unknown[]): void;
    error(format: string, ...args: unknown[]): void;
}