import { apiCall, buildQueryString } from "./client";
import {
  type JobListFilters,
  type JobListResponse,
  JobListResponseSchema,
  type JobPosting,
  JobPostingSchema,
  type StatsResponse,
  StatsResponseSchema,
} from "./schemas";

// ============================================================
//  Raw API functions
// ============================================================

/** Fetch a paginated, filtered list of job postings. */
export async function fetchJobs(
  filters: JobListFilters,
  signal?: AbortSignal,
): Promise<JobListResponse> {
  const qs = buildQueryString(filters);
  return apiCall(`/jobs/${qs}`, JobListResponseSchema, { signal });
}

/** Fetch a single job by its numeric ID. */
export async function fetchJobById(jobId: number): Promise<JobPosting> {
  return apiCall(`/jobs/${jobId}`, JobPostingSchema);
}

/** Fetch a single job by its record_id string. */
export async function fetchJobByRecordId(
  recordId: string,
): Promise<JobPosting> {
  return apiCall(`/jobs/record/${recordId}`, JobPostingSchema);
}

/** Fetch aggregated job statistics. */
export async function fetchStats(): Promise<StatsResponse> {
  return apiCall(`/jobs/stats`, StatsResponseSchema);
}
