/**
 * Logging Utilities
 * Centralized logging with different levels and formatting
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level ?? LogLevel.INFO,
      prefix: config.prefix ?? '',
      timestamp: config.timestamp ?? true,
      colors: config.colors ?? true,
    };
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const parts: string[] = [];

    if (this.config.timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }

    parts.push(`[${level}]`);
    parts.push(message);

    if (args.length > 0) {
      parts.push(JSON.stringify(args, null, 2));
    }

    return parts.join(' ');
  }

  private getColor(level: LogLevel): string {
    if (!this.config.colors) return '';

    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    };

    return colors[level] || '';
  }

  private resetColor(): string {
    return this.config.colors ? '\x1b[0m' : '';
  }

  debug(message: string, ...args: any[]): void {
    if (this.config.level <= LogLevel.DEBUG) {
      const formatted = this.formatMessage('DEBUG', message, ...args);
      console.debug(`${this.getColor(LogLevel.DEBUG)}${formatted}${this.resetColor()}`);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.config.level <= LogLevel.INFO) {
      const formatted = this.formatMessage('INFO', message, ...args);
      console.info(`${this.getColor(LogLevel.INFO)}${formatted}${this.resetColor()}`);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.config.level <= LogLevel.WARN) {
      const formatted = this.formatMessage('WARN', message, ...args);
      console.warn(`${this.getColor(LogLevel.WARN)}${formatted}${this.resetColor()}`);
    }
  }

  error(message: string, error?: Error | any, ...args: any[]): void {
    if (this.config.level <= LogLevel.ERROR) {
      const formatted = this.formatMessage('ERROR', message, ...args);
      console.error(`${this.getColor(LogLevel.ERROR)}${formatted}${this.resetColor()}`);
      
      if (error) {
        if (error instanceof Error) {
          console.error(`${this.getColor(LogLevel.ERROR)}Stack: ${error.stack}${this.resetColor()}`);
        } else {
          console.error(`${this.getColor(LogLevel.ERROR)}${JSON.stringify(error, null, 2)}${this.resetColor()}`);
        }
      }
    }
  }

  // Utility methods
  separator(char: string = '━', length: number = 60): void {
    this.info(char.repeat(length));
  }

  section(title: string): void {
    this.separator();
    this.info(title);
    this.separator();
  }

  success(message: string, ...args: any[]): void {
    this.info(`✅ ${message}`, ...args);
  }

  failure(message: string, ...args: any[]): void {
    this.error(`❌ ${message}`, ...args);
  }

  loading(message: string, ...args: any[]): void {
    this.info(`⏳ ${message}`, ...args);
  }

  complete(message: string, ...args: any[]): void {
    this.info(`✨ ${message}`, ...args);
  }
}

// Default logger instance
export const logger = new Logger({
  level: process.env.LOG_LEVEL === 'debug' ? LogLevel.DEBUG : LogLevel.INFO,
  colors: true,
  timestamp: true,
});

// Create logger with custom config
export function createLogger(config: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}

export default logger;
