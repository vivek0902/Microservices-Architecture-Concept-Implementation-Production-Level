import winston from 'winston';
import { config } from './index';

const isProduction = process.env.NODE_ENV === 'production';

const errorsFormatter = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
      name: info.name,
    };
  }

  const maybeError = info.error;
  if (maybeError instanceof Error) {
    return {
      ...info,
      error: {
        name: maybeError.name,

        message: maybeError.message,
        stack: maybeError.stack,
      },
    };
  }

  return info;
});

const devFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : '';
    return `[${timestamp}] [${level}] [${service}]: ${String(message)}${metaString}`;
  }),
);

const prodFormat = winston.format.combine(winston.format.json());

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { service: config.SERVICE_NAME },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    errorsFormatter(),
    isProduction ? prodFormat : devFormat,
  ),
  transports: [new winston.transports.Console({ handleExceptions: true })],
  exitOnError: false,
});

export const createLoggerWithContext = (
  context: Record<string, string | number | boolean>,
) => logger.child(context);

export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
