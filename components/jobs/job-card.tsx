import { formatDistanceToNow } from "date-fns";
import { BanknoteIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobPosting } from "@/lib/api/schemas";
import { cn } from "@/lib/utils";

interface JobRowProps {
  job: JobPosting;
  className?: string;
}

export function JobRow({ job, className }: JobRowProps) {
  const location = [job.location?.city, job.location?.state]
    .filter(Boolean)
    .join(", ");

  const postDate = job.post_date
    ? formatDistanceToNow(new Date(job.post_date), { addSuffix: true })
    : null;

  const salary =
    job.salary?.min && job.salary?.max
      ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
      : job.salary?.min
        ? `$${job.salary.min.toLocaleString()}+`
        : job.salary?.max
          ? `Up to $${job.salary.max.toLocaleString()}`
          : null;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "group flex flex-col gap-1 rounded-md border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h3
          className="truncate text-sm font-medium text-foreground"
          lang={job.language === "korean" ? "ko" : undefined}
        >
          {job.title}
        </h3>
        <p
          className="text-xs text-muted-foreground"
          lang={job.language === "korean" ? "ko" : undefined}
        >
          {job.company}
        </p>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:mt-0 sm:shrink-0">
        {location && (
          <span className="flex items-center gap-1">
            <MapPinIcon className="size-3" />
            {location}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1">
            <BanknoteIcon className="size-3" />
            {salary}
          </span>
        )}
        {postDate && (
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3" />
            {postDate}
          </span>
        )}
      </div>
    </Link>
  );
}

export function JobRowSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-md px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function JobListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton array
        <JobRowSkeleton key={i} />
      ))}
    </div>
  );
}
