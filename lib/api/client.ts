import { showApiError } from "@/lib/api/errorToast";
import { ApiError, isApiError } from "@/lib/api/error";

export { ApiError, isApiError } from "@/lib/api/error";

type ApiErrorPayload = {
  message?: unknown;
  code?: unknown;
  correlationId?: unknown;
};

type ApiResponse<T> = {
  data?: T;
  error?: string | ApiErrorPayload;
  success?: boolean;
};

function toApiError(body: (ApiResponse<unknown> & Record<string, unknown>) | null, status: number) {
  const payload = body?.error;
  if (typeof payload === "string") return new ApiError(payload, status);

  if (payload && typeof payload === "object") {
    const detail = payload as ApiErrorPayload;
    return new ApiError(
      typeof detail.message === "string" ? detail.message : "Unable to complete the request.",
      status,
      {
        code: typeof detail.code === "string" ? detail.code : undefined,
        correlationId: typeof detail.correlationId === "string" ? detail.correlationId : undefined,
      },
    );
  }

  return new ApiError("Unable to complete the request.", status);
}

async function readApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as
    | (ApiResponse<T> & Record<string, unknown>)
    | null;

  if (!response.ok) throw toApiError(body, response.status);
  return body?.data !== undefined ? body.data : (body as T);
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(input, init);
    return await readApiResponse<T>(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;

    const apiError = isApiError(error)
      ? error
      : new ApiError("Unable to reach the server. Please check your connection and try again.", 0);
    showApiError(apiError);
    throw apiError;
  }
}