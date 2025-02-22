/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types/types";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(
    `[${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.url}`,
  );

  const statusCode = 404;

  const errorResponse: ErrorResponse = {
    status: statusCode,
    message: "Resource not found",
    error: {
      name: "NotFoundError",
      details: {
        path: req.url,
        method: req.method,
      },
    },
  };

  return res.status(errorResponse.status).json(errorResponse);
};
