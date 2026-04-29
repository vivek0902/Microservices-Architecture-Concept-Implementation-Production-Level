import winston from 'winston';
import { config } from '.';

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { service: config.SERVICE_NAME },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, service, stack, ...meta }) => {
      const output = stack || message;
      const metadata = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';

      return `[${timestamp}] [${level}] [${service}]: ${output}${metadata}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
