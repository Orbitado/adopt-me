import { RequestHandler } from "express";
import { createLogger, format, transports, Logger } from "winston";

declare module "express-serve-static-core" {
  interface Request {
    logger: Logger;
  }
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export const addLogger: RequestHandler = (req, _res, next) => {
  req.logger = logger;
  req.logger.info(`Request received: ${req.method}, URL: ${req.url}`);
  next();
};
