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
    const description =
      job.description?.replace(/<[^>]*>/g, "").slice(0, 160) ??
      `Job posting for ${job.title} at ${job.company}`;
    return {
      title,
      description,
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
        description: job.description?.replace(/<[^>]*>/g, "") ?? "",
        datePosted: job.post_date ?? job.created_at,
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
        },
        jobLocation: job.location_country
          ? {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: job.location_city ?? "",
                addressRegion: job.location_state ?? "",
                addressCountry: job.location_country ?? "",
              },
            }
          : undefined,
        baseSalary:
          job.salary_min || job.salary_max
            ? {
                "@type": "MonetaryAmount",
                currency: job.currency ?? "USD",
                value: {
                  "@type": "QuantitativeValue",
                  minValue: job.salary_min ?? undefined,
                  maxValue: job.salary_max ?? undefined,
                  unitText: job.salary_period ?? "YEAR",
                },
              }
            : undefined,
        employmentType: job.job_status ?? undefined,
        occupationalCategory: job.job_category ?? undefined,
        industry: job.source ?? undefined,
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
