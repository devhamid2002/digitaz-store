"use client";

import { useQuery, type QueryKey } from "@tanstack/react-query";
import type { ActionResult } from "@/utils/actionResult";

// Runs an action-backed query and unwraps its result. Failures throw so the
// global query cache handler can toast the resolved message exactly once.
export function useActionQuery<T>(
  queryKey: QueryKey,
  action: () => Promise<ActionResult<T>>
) {
  const { data, isLoading } = useQuery({
    queryKey,
    // Action failures are already normalized, so retrying only delays the toast
    retry: false,
    queryFn: async () => {
      const result = await action();
      if ("error" in result) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });

  return { data, isLoading };
}
