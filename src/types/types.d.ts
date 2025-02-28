export interface CustomError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ErrorResponse {
  status: number;
  message: string;
  error: {
    name: string;
    stack?: string;
    code?: string;
    details?: unknown;
  };
}

export interface ValidationError extends Error {
  name: string;
  message: string;
  errors?: Record<string, unknown>;
}
