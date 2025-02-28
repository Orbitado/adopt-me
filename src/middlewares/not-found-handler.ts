/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types/types";
import { ErrorDictionary } from "../utils/error-dictionary";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(
    `[${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.url}`,
  );

  const details = {
    path: req.url,
    method: req.method,
  };

  const customError = ErrorDictionary.resourceNotFound(
    "Resource",
    undefined,
    details,
  );

  const errorResponse: ErrorResponse = {
    status: customError.status || 404,
    message: customError.message || "Resource not found",
    error: {
      name: customError.name,
      code: customError.code,
      details: customError.details,
    },
  };

  res.status(errorResponse.status).json(errorResponse);
};
