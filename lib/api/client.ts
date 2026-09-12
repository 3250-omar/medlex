export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type ApiResponse<T> = {
  data?: T;
  error?: string;
  success?: boolean;
};

async function readApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as
    | (ApiResponse<T> & Record<string, unknown>)
    | null;

  if (!response.ok) {
    throw new ApiError(
      body?.error ?? "Unable to complete the request.",
      response.status,
    );
  }

  if (body?.data !== undefined) {
    return body.data;
  }

  return body as unknown as T;
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  return readApiResponse<T>(response);
}
