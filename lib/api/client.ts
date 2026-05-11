import type { z } from "zod";

const API_BASE =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001/api/v1")
    : "/api/v1";

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
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      throw new ApiError(response.status, response.statusText, errorBody, {
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : null,
      });
    }
    throw new ApiError(response.status, response.statusText, errorBody);
  }

  const data = await response.json();
  return schema.parse(data);
}

export class ApiError extends Error {
  public isRateLimited: boolean;
  public retryAfter: number | null;

  constructor(
    public status: number,
    public statusText: string,
    public body: string,
    rateLimit?: { retryAfter: number | null },
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
    this.isRateLimited = status === 429;
    this.retryAfter = rateLimit?.retryAfter ?? null;
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
    if (value === undefined || value === null) continue;
    const str = String(value).trim();
    if (str === "") continue;
    params.append(key, str);
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
