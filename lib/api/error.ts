export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly correlationId?: string;
  toastShown = false;

  constructor(
    message: string,
    status: number,
    options?: { code?: string; correlationId?: string },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = options?.code;
    this.correlationId = options?.correlationId;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}