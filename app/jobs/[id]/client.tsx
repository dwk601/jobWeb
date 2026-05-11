"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BanknoteIcon,
  Building2,
  Clock,
  ExternalLinkIcon,
  MailIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJobById } from "@/lib/api/jobs";

interface JobDetailClientProps {
  jobId: number;
}

export function JobDetailClient({ jobId }: JobDetailClientProps) {
  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs", "detail", jobId],
    queryFn: () => fetchJobById(jobId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (isError || !job) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">Job not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "This posting could not be loaded."}
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to jobs
        </Link>
      </div>
    );
  }

  const location = [job.location?.city, job.location?.state]
    .filter(Boolean)
    .join(", ");

  const salary =
    job.salary?.min && job.salary?.max
      ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
      : job.salary?.min
        ? `$${job.salary.min.toLocaleString()}+`
        : job.salary?.max
          ? `Up to $${job.salary.max.toLocaleString()}`
          : null;

  const salaryInfo = job.salary
    ? [salary, job.salary.unit].filter(Boolean).join(" / ")
    : null;

  const postDate = job.post_date
    ? new Date(job.post_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const scrapedDate = job.scraped_at
    ? new Date(job.scraped_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const categories = job.job_category?.join(", ");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to jobs
      </Link>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              {job.source}
            </span>
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              {job.language}
            </span>
            {job.company_inferred && (
              <span className="text-[10px] text-muted-foreground">
                company inferred
              </span>
            )}
          </div>

          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {job.title}
          </h1>

          <div className="mt-3 flex items-center gap-1.5 text-sm">
            <Building2 className="size-4 text-muted-foreground" />
            <span className="font-medium">{job.company}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            {location && (
              <span className="flex items-center gap-1">
                <MapPinIcon className="size-3.5" />
                {location}
              </span>
            )}
            {salaryInfo && (
              <span className="flex items-center gap-1">
                <BanknoteIcon className="size-3.5" />
                {salaryInfo}
              </span>
            )}
            {postDate && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                Posted {postDate}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLinkIcon className="size-3" />
                Original posting
              </a>
            )}
            {job.contact && (
              <a
                href={`mailto:${job.contact}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <MailIcon className="size-3" />
                {job.contact}
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <section className="border-t border-border pt-6">
            <h2 className="mb-4 text-sm font-semibold">Description</h2>
            <div
              className="prose prose-sm max-w-none text-sm leading-relaxed [&_a]:text-primary"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: job descriptions are HTML from the API
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </section>
        )}

        {/* Details */}
        <section className="border-t border-border pt-6">
          <h2 className="mb-3 text-sm font-semibold">Details</h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Source</dt>
              <dd>{job.source}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Language</dt>
              <dd className="uppercase">{job.language}</dd>
            </div>
            {categories && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Categories</dt>
                <dd>{categories}</dd>
              </div>
            )}
            {job.salary?.raw && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Compensation</dt>
                <dd className="text-xs whitespace-pre-wrap">
                  {job.salary.raw}
                </dd>
              </div>
            )}
            {postDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Posted</dt>
                <dd>{postDate}</dd>
              </div>
            )}
            {scrapedDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Last updated</dt>
                <dd>{scrapedDate}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </div>
  );
}

function JobDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <div className="flex gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
