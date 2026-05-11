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
    return {
      title: `${job.title} at ${job.company}`,
      description:
        job.description?.slice(0, 160) ?? `Job posting for ${job.title}`,
    };
  } catch {
    return {
      title: "Job Details",
      description: "View detailed job posting information",
    };
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const jobId = Number(id);

  const queryClient = makeQueryClient();

  // Prefetch the job on the server
  await queryClient.prefetchQuery({
    queryKey: ["jobs", "detail", jobId],
    queryFn: () => fetchJobById(jobId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 py-8">
        <JobDetailClient jobId={jobId} />
      </div>
    </HydrationBoundary>
  );
}
