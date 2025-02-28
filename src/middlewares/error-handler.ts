/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError, ErrorResponse, ValidationError } from "../types/types";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const err = error as ValidationError;
  let customError = error as CustomError;

  if (
    err.name === "ValidationError" ||
    err.message?.includes("validation failed")
  ) {
    customError = {
      ...error,
      status: 400,
      code: "VALIDATION_ERROR",
      details: err.errors || {},
    };
  }

  console.error(
    `[${new Date().toISOString()}] ERROR: ${req.method} ${req.url}\n` +
      `Message: ${customError.message}\n` +
      `Status: ${customError.status || 500}\n` +
      `Code: ${customError.code || "No error code"}\n` +
      `Details: ${JSON.stringify(customError.details || {}, null, 2)}`,
  );

  const statusCode = customError.status || 500;

  const errorResponse: ErrorResponse = {
    status: statusCode,
    message: customError.message || "Internal Server Error",
    error: {
      name: customError.name,
      code: customError.code,
      details: customError.details,
    },
  };

  res.status(errorResponse.status).json(errorResponse);
};
