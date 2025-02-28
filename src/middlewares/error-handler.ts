/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError, ErrorResponse } from "../types/types";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(
    `[${new Date().toISOString()}] ERROR: ${req.method} ${req.url}\n` +
      `Message: ${error.message}\n` +
      `Status: ${(error as CustomError).status || 500}\n` +
      `Code: ${(error as CustomError).code || "No error code"}\n` +
      `Details: ${JSON.stringify((error as CustomError).details || {}, null, 2)}`,
  );

  const statusCode = (error as CustomError).status || 500;

  const errorResponse: ErrorResponse = {
    status: statusCode,
    message: error.message || "Internal Server Error",
    error: {
      name: error.name,
      code: (error as CustomError).code,
      details: (error as CustomError).details,
    },
  };

  res.status(errorResponse.status).json(errorResponse);
};
