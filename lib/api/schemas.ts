import { z } from "zod";

// ============================================================
//  Job Posting
// ============================================================
export const JobLocationSchema = z.object({
  raw: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
});

export const JobSalarySchema = z.object({
  max: z.number().nullable(),
  min: z.number().nullable(),
  raw: z.string().nullable(),
  unit: z.string().nullable(),
  parsed: z.boolean(),
  currency: z.string().nullable(),
});

export const JobMetaSchema = z.object({
  record_id: z.string().optional(),
  list_page_url: z.string().optional(),
  schema_version: z.string().optional(),
  detail_fetch_error: z.unknown().nullable(),
  detail_fetch_status: z.number().nullable(),
});

export const JobPostingSchema = z.object({
  id: z.number(),
  record_id: z.string(),
  source: z.string(),
  title: z.string(),
  company: z.string(),
  location: JobLocationSchema.nullable(),
  salary: JobSalarySchema.nullable(),
  language: z.string(),
  post_date: z.string().nullable(),
  link: z.string().nullable(),
  job_category: z.array(z.string()).nullable(),
  company_inferred: z.boolean().optional(),
  description: z.string().nullable().optional(),
  description_length: z.number().optional(),
  contact: z.string().nullable().optional(),
  post_date_raw: z.string().nullable().optional(),
  scraped_at: z.string().optional(),
  meta: JobMetaSchema.nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type JobPosting = z.infer<typeof JobPostingSchema>;

// ============================================================
//  List Response
// ============================================================
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
  "source",
  "language",
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
  language: z.string().optional(),
  location_city: z.string().optional(),
  location_state: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  post_date_from: z.string().optional(),
  post_date_to: z.string().optional(),
  sort_by: SortFieldSchema.default("post_date"),
  sort_order: SortOrderSchema.default("desc"),
  page: z.number().int().min(1).default(1),
  page_size: z.number().int().min(1).max(100).default(20),
});

export type JobListFilters = z.input<typeof JobListFiltersSchema>;
