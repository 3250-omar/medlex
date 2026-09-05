import { toast } from "@/components/ui/toast";
import { isApiError } from "@/lib/api/client";

export function showApiError(error: unknown, suppressGlobalError = false) {
  if (!isApiError(error) || suppressGlobalError) return;

  toast.add({
    id: `api-error-${error.status}-${error.message}`,
    type: "error",
    title: "Request failed",
    description: error.message,
    priority: "high",
  });
}
