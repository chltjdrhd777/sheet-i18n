import { createLogger, format, transports } from 'winston';

import { InitLoggerError } from '../Errors';
import { ColorCode } from '../constants/colorCode';

const { reset, magenta } = ColorCode;

export class Logger {
  private static instance?: ReturnType<typeof createLogger>;

  public static getInstance() {
    try {
      if (!Logger.instance) {
        Logger.instance = createLogger({
          level: 'info',
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf((info) => {
              const { timestamp, level, message } = info;

              return `${magenta}${timestamp}${reset} [${level}]: ${message}`;
            })
          ),
          transports: [new transports.Console()],
        });
      }

      return Logger.instance;
    } catch {
      throw new InitLoggerError('⚠️ Failed to initialize logger.');
    }
  }
}
