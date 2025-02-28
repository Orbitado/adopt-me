import { CustomError } from "../types/types";

export enum ErrorCode {
  RESOURCE_EXISTS = "RESOURCE_EXISTS",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  INVALID_REQUEST = "INVALID_REQUEST",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class ErrorDictionary {
  static createError(
    message: string,
    code: ErrorCode,
    status: number,
    details?: unknown,
  ): CustomError {
    const error: CustomError = new Error(message);
    error.status = status;
    error.code = code;
    error.details = details;
    return error;
  }

  static resourceExists(resource: string, details?: unknown): CustomError {
    return this.createError(
      `${resource} already exists`,
      ErrorCode.RESOURCE_EXISTS,
      400,
      details,
    );
  }

  static resourceNotFound(
    resource: string,
    id?: string,
    details?: unknown,
  ): CustomError {
    const message = id
      ? `${resource} not found with id: ${id}`
      : `${resource} not found`;

    return this.createError(
      message,
      ErrorCode.RESOURCE_NOT_FOUND,
      404,
      details,
    );
  }

  static invalidRequest(message: string, details?: unknown): CustomError {
    return this.createError(message, ErrorCode.INVALID_REQUEST, 400, details);
  }

  static unauthorized(
    message = "Unauthorized access",
    details?: unknown,
  ): CustomError {
    return this.createError(message, ErrorCode.UNAUTHORIZED, 401, details);
  }

  static forbidden(
    message = "Forbidden access",
    details?: unknown,
  ): CustomError {
    return this.createError(message, ErrorCode.FORBIDDEN, 403, details);
  }

  static internalServerError(
    message = "Internal Server Error",
    details?: unknown,
  ): CustomError {
    return this.createError(
      message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      details,
    );
  }
}
