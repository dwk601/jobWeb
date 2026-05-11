import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchJobById } from "@/lib/api/jobs";
import { makeQueryClient } from "@/lib/query-client";
import { JobDetailClient } from "./client";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const job = await fetchJobById(Number(id));
    const title = `${job.title} at ${job.company}`;
    const location = [job.location?.city, job.location?.state]
      .filter(Boolean)
      .join(", ");
    const description = [
      job.company,
      location,
      job.description
        ?.replace(/<[^>]*>/g, "")
        .slice(0, 120)
        .trim(),
    ]
      .filter(Boolean)
      .join(" - ")
      .slice(0, 160);
    return {
      title,
      description: description || `Job posting for ${job.title}`,
      alternates: {
        canonical: `/jobs/${job.id}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
      },
    };
  } catch {
    return {
      title: "Job Details",
      description: "View detailed job posting information",
      alternates: {
        canonical: "/jobs",
      },
    };
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const jobId = Number(id);

  const queryClient = makeQueryClient();

  let job = null;
  try {
    job = await fetchJobById(jobId);
  } catch {
    // Job not found, handled by client
  }

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "detail", jobId],
    queryFn: () => fetchJobById(jobId),
  });

  const jsonLd = job
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.link ?? "",
        datePosted: job.post_date,
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
        },
        jobLocation:
          job.location?.city || job.location?.state
            ? {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: job.location.city ?? "",
                  addressRegion: job.location.state ?? "",
                },
              }
            : undefined,
        baseSalary:
          job.salary?.min || job.salary?.max
            ? {
                "@type": "MonetaryAmount",
                currency: job.salary.currency ?? "USD",
                value: {
                  "@type": "QuantitativeValue",
                  minValue: job.salary.min ?? undefined,
                  maxValue: job.salary.max ?? undefined,
                  unitText: job.salary.unit ?? "YEAR",
                },
              }
            : undefined,
        occupationalCategory: job.job_category?.join(", "),
        industry: job.source,
      }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <JobDetailClient jobId={jobId} />
    </HydrationBoundary>
  );
}
