import type { z } from "zod";

const API_BASE = "/api/v1";

/**
 * Typed fetch with Zod validation.
 * Uses the Next.js proxy so no CORS issues.
 */
export async function apiCall<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  options?: RequestInit,
): Promise<z.infer<T>> {
  const url = `${API_BASE}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(response.status, response.statusText, errorBody);
  }

  const data = await response.json();
  return schema.parse(data);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Helper to build query string from filters object.
 * Omits undefined/null/empty values.
 */
export function buildQueryString(
  filters: Record<string, string | number | boolean | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    params.append(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
