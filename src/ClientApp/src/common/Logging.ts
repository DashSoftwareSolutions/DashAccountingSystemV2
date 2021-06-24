export interface ILogger {
    trace(format: string, ...args: any[]): void;
    debug(format: string, ...args: any[]): void;
    info(format: string, ...args: any[]): void;
    warn(format: string, ...args: any[]): void;
    error(format: string, ...args: any[]): void;
}

export class Logger implements ILogger {
    private name: string
    constructor(name: string) {
        this.name = name
    }

    trace(format: string, ...args: any[]) {
        if (console) {
            if (console.trace) {
                console.trace(`[${this.name}] ${format}`, ...args);
            } else {
                console.log(`[${this.name} trace] ${format}`, ...args)
            }
        }
    }

    debug(format: string, ...args: any[]) {
        if (console) {
            if (console.debug) {
                console.debug(`[${this.name}] ${format}`, ...args);
            } else {
                console.log(`[${this.name} debug] ${format}`, ...args)
            }
        }
    }

    info(format: string, ...args: any[]) {
        if (console) {
            if (console.info) {
                console.info(`[${this.name}] ${format}`, ...args);
            } else {
                console.log(`[${this.name} info] ${format}`, ...args)
            }
        }
    }

    warn(format: string, ...args: any[]) {
        if (console) {
            if (console.warn) {
                console.warn(`[${this.name}] ${format}`, ...args);
            } else {
                console.log(`[${this.name} warn] ${format}`, ...args)
            }
        }
    }

    error(format: string, ...args: any[]) {
        if (console) {
            if (console.error) {
                console.error(`[${this.name}] ${format}`, ...args);
            } else {
                console.log(`[${this.name} error] ${format}`, ...args)
            }
        }
    }
}