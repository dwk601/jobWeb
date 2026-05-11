import { z } from "zod";

// ============================================================
//  Job Posting
// ============================================================
export const JobPostingSchema = z.object({
  id: z.number(),
  record_id: z.string(),
  title: z.string(),
  company: z.string(),
  company_inferred: z.boolean().default(false),
  location_city: z.string().nullable(),
  location_state: z.string().nullable(),
  location_country: z.string().nullable(),
  salary_min: z.number().nullable(),
  salary_max: z.number().nullable(),
  currency: z.string().nullable(),
  salary_period: z.string().nullable(),
  job_category: z.string().nullable(),
  job_status: z.string().nullable(),
  language: z.string(),
  source: z.string(),
  post_date: z.string().nullable(),
  description: z.string().nullable(),
  contact: z.string().nullable(),
  meta: z.record(z.string(), z.unknown()).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type JobPosting = z.infer<typeof JobPostingSchema>;

// ============================================================
//  List Response
// ============================================================
const _PaginationMetaSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  total: z.number(),
  total_pages: z.number(),
});

export const JobListResponseSchema = z.object({
  items: z.array(JobPostingSchema),
  total: z.number(),
  page: z.number(),
  page_size: z.number(),
  total_pages: z.number(),
});

export type JobListResponse = z.infer<typeof JobListResponseSchema>;

// ============================================================
//  Filters
// ============================================================
export const SortFieldSchema = z.enum([
  "id",
  "title",
  "company",
  "post_date",
  "created_at",
  "updated_at",
  "source",
  "language",
  "description_length",
]);
export type SortField = z.infer<typeof SortFieldSchema>;

export const SortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof SortOrderSchema>;

// ============================================================
//  Stats
// ============================================================
export const StatsResponseSchema = z.object({
  total_jobs: z.number(),
  by_source: z.record(z.string(), z.number()),
  by_language: z.record(z.string(), z.number()),
  by_company: z.record(z.string(), z.number()),
  salary_stats: z.object({
    min_salary: z.number().nullable(),
    avg_salary: z.number().nullable(),
    max_salary: z.number().nullable(),
  }),
});

export type StatsResponse = z.infer<typeof StatsResponseSchema>;

// ============================================================
//  List Filters (for API query params)
// ============================================================
export const JobListFiltersSchema = z.object({
  q: z.string().optional(),
  source: z.string().optional(),
  company: z.string().optional(),
  company_inferred: z.boolean().optional(),
  language: z.string().optional(),
  location_city: z.string().optional(),
  location_state: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  job_category: z.string().optional(),
  post_date_from: z.string().optional(),
  post_date_to: z.string().optional(),
  sort_by: SortFieldSchema.default("post_date"),
  sort_order: SortOrderSchema.default("desc"),
  page: z.number().int().min(1).default(1),
  page_size: z.number().int().min(1).max(100).default(20),
});

export type JobListFilters = z.input<typeof JobListFiltersSchema>;
