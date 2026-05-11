import "server-only";
import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import { createSearchParamsCache } from "nuqs/server";

// ============================================================
//  Shared search params configuration
// ============================================================

export const searchParams = {
  // Text search
  q: parseAsString.withDefault(""),

  // Filters
  source: parseAsString,
  company: parseAsString,
  company_inferred: parseAsInteger,
  language: parseAsString,
  location_city: parseAsString,
  location_state: parseAsString,
  job_category: parseAsString,
  job_status: parseAsString,

  // Salary
  salary_min: parseAsFloat,
  salary_max: parseAsFloat,

  // Date
  post_date_from: parseAsString,
  post_date_to: parseAsString,

  // Sorting
  sort_by: parseAsStringEnum([
    "id",
    "title",
    "company",
    "post_date",
    "created_at",
    "updated_at",
    "source",
    "language",
    "description_length",
  ]).withDefault("post_date"),

  sort_order: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),

  // Pagination
  page: parseAsInteger.withDefault(1),
  page_size: parseAsInteger.withDefault(20),
} as const;

// ============================================================
//  Server-side search params cache
// ============================================================
export const searchParamsCache = createSearchParamsCache(searchParams);

// ============================================================
//  Helper: serialize search params for link hrefs
// ============================================================
export function filtersToQueryString(
  filters: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export type SearchParams = typeof searchParams;
export type FiltersState = {
  [K in keyof SearchParams]: SearchParams[K] extends {
    parse: (v: string) => infer T;
  }
    ? T
    : SearchParams[K] extends {
          parse: (v: string) => infer T;
          withDefault: unknown;
        }
      ? T
      : string;
};
