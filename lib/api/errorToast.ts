import { toast } from "@/components/ui/toast";
import { isApiError } from "@/lib/api/error";

export function showApiError(error: unknown, suppressGlobalError = false) {
  if (suppressGlobalError || typeof window === "undefined") return;
  if (isApiError(error) && error.toastShown) return;

  const message = error instanceof Error ? error.message.trim() : "Unable to complete the request.";
  if (!message) return;

  if (isApiError(error)) error.toastShown = true;
  toast.add({
    id: `api-error-${isApiError(error) ? error.status : "unknown"}-${message}`,
    type: "error",
    title: "Request failed",
    description: message,
    priority: "high",
  });
}