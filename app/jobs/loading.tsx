import { JobListSkeleton } from "@/components/jobs/job-card";

export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="h-9 w-64 animate-pulse rounded bg-secondary" />
      <div className="mt-4 mb-3 h-px bg-border" />
      <JobListSkeleton count={10} />
    </div>
  );
}
