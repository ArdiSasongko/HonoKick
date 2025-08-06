import pino, { Logger as PinoLogger } from "pino";
import env from "./config";

export class Logger {
  private static instance: Logger;
  private logger: PinoLogger;

  constructor() {
    const isProd = env.NODE_ENV === "PROD";

    this.logger = isProd
      ? pino({
          level: "info",
          formatters: {
            level(label) {
              return { level: label };
            },
            log(object) {
              const { req, res, ...rest } = object;
              return rest;
            },
          },
          timestamp: pino.stdTimeFunctions.isoTime,
          transport: {
            target: "pino/file",
            options: {
              destination: "./logs/app.log",
              mkdir: true,
            },
          },
        })
      : pino({
          level: "debug",
          formatters: {
            level(label) {
              return { level: label };
            },
          },
          timestamp: pino.stdTimeFunctions.isoTime,
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
              translateTime: "yyyy-mm-dd HH:MM:ss",
              singleLine: false,
            },
          },
        });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Enhanced info logging with context
   * @param message Main log message or object
   * @param context Additional context object or parameters
   */
  public info(message: string | object, context?: object | any): void {
    if (typeof message === 'string' && context) {
      // Extract key information from context if it's an object
      if (typeof context === 'object' && context !== null && !Array.isArray(context)) {
        const { id, userId, email, action, resource, ...rest } = context;
        
        // Build a more informative log message with key context
        const contextStr = [
          id ? `id=${id}` : '',
          userId ? `userId=${userId}` : '',
          email ? `email=${email}` : '',
          action ? `action=${action}` : '',
          resource ? `resource=${resource}` : '',
        ].filter(Boolean).join(' ');
        
        // Log the enhanced message with remaining context as object
        this.logger.info(
          { ...rest, msg: `${message}${contextStr ? ` [${contextStr}]` : ''}` }
        );
      } else {
        // Handle non-object context
        this.logger.info(message, context);
      }
    } else {
      // Handle object messages or simple string messages
      this.logger.info(message);
    }
  }

  public error(message: string | object, ...args: any[]): void {
    if (typeof message === 'object' && message !== null) {
      if (message instanceof Error) {
        const errorObj = {
          message: message.message,
          ...(message as any),
        };
        
        if (env.NODE_ENV === "PROD") {
          delete errorObj.stack;
        }
        
        this.logger.error(errorObj, ...args);
      } else {
        // For regular objects
        this.logger.error(message, ...args);
      }
    } else {
      // For string messages
      this.logger.error(message, ...args);
    }
  }

  /**
   * Enhanced warning logging with context
   * @param message Main log message or object
   * @param context Additional context object or parameters
   */
  public warn(message: string | object, context?: object | any): void {
    if (typeof message === 'string' && context && typeof context === 'object') {
      const { id, userId, email, action, resource, ...rest } = context;
      
      const contextStr = [
        id ? `id=${id}` : '',
        userId ? `userId=${userId}` : '',
        email ? `email=${email}` : '',
        action ? `action=${action}` : '',
        resource ? `resource=${resource}` : '',
      ].filter(Boolean).join(' ');
      
      this.logger.warn(
        { ...rest, msg: `${message}${contextStr ? ` [${contextStr}]` : ''}` }
      );
    } else {
      this.logger.warn(message, context);
    }
  }

  public debug(message: string | object, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  public trace(message: string | object, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }

  public fatal(message: string | object, ...args: any[]): void {
    this.logger.fatal(message, ...args);
  }
}

// For backward compatibility
const loggerInstance = Logger.getInstance();
export default loggerInstance;
