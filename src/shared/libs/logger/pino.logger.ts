import { Logger as PinoInstance, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';
import { injectable } from 'inversify';
import { resolve, dirname } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';
import {
  LOG_FILE_PATH,
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_INFO,
  LOG_TARGET_FILE,
} from '../../types/index.js';
@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const destination = resolve(LOG_FILE_PATH);

    const logDir = dirname(destination);

    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    const multiTransport = transport({
      targets: [
        {
          target: LOG_TARGET_FILE,
          options: { destination },
          level: LOG_LEVEL_DEBUG,
        },
        {
          target: LOG_TARGET_FILE,
          level: LOG_LEVEL_INFO,
          options: {},
        },
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created…');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
