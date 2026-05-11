import { expect, type Page, test } from "@playwright/test";

interface MockJobOverrides {
  id?: number;
  title?: string;
  company?: string | null;
  language?: string;
}

function mockJob(overrides: MockJobOverrides = {}) {
  return {
    id: 1,
    record_id: "rec-001",
    source: "indeed",
    title: "Software Engineer",
    company: "Test Corp",
    location: { raw: "Remote, USA", city: "Remote", state: "CA" },
    salary: null,
    language: "en",
    post_date: "2024-01-15",
    link: "https://example.com/job/1",
    job_category: ["Technology"],
    company_inferred: false,
    description: "<p>Test job description.</p>",
    description_length: 50,
    contact: null,
    post_date_raw: "2024-01-15",
    scraped_at: "2024-01-15T00:00:00Z",
    meta: null,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    ...overrides,
  };
}

function mockJobsResponse(items: unknown[], total?: number) {
  return {
    items,
    total: total ?? items.length,
    page: 1,
    page_size: 20,
    total_pages: Math.max(1, Math.ceil((total ?? items.length) / 20)),
  };
}

async function setupApiRoute(page: Page, response: object) {
  await page.route("**/api/v1/jobs/**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      json: response,
    });
  });
}

test.describe("Job Search", () => {
  test("normal search displays results", async ({ page }) => {
    await setupApiRoute(
      page,
      mockJobsResponse([
        mockJob(),
        mockJob({ id: 2, title: "Product Manager" }),
      ]),
    );

    await page.goto("/jobs");
    await page
      .getByPlaceholder("Search titles and companies...")
      .first()
      .fill("engineer");
    await page.keyboard.press("Enter");

    await expect(page.getByText("Software Engineer")).toBeVisible();
    await expect(page.getByText("Product Manager")).toBeVisible();
    await expect(page.getByText("Test Corp").first()).toBeVisible();
    await expect(page.getByText("Error loading jobs")).not.toBeVisible();
  });

  test("space-only search does not show error", async ({ page }) => {
    await setupApiRoute(page, mockJobsResponse([]));

    await page.goto("/jobs");
    await page
      .getByPlaceholder("Search titles and companies...")
      .first()
      .fill("  ");
    await page.keyboard.press("Enter");

    await expect(page.getByText("Error loading jobs")).not.toBeVisible();
    await expect(page.getByText("No jobs found")).toBeVisible();
  });

  test("search with null company renders without error", async ({ page }) => {
    await setupApiRoute(page, mockJobsResponse([mockJob({ company: null })]));

    await page.goto("/jobs");
    await page
      .getByPlaceholder("Search titles and companies...")
      .first()
      .fill("test");
    await page.keyboard.press("Enter");

    await expect(page.getByText("Unknown company")).toBeVisible();
    await expect(page.getByText("Error loading jobs")).not.toBeVisible();
  });

  test("Korean search with valid results", async ({ page }) => {
    await setupApiRoute(
      page,
      mockJobsResponse([
        mockJob({
          id: 1,
          title: "소프트웨어 개발자",
          company: "한국 회사",
          language: "ko",
        }),
      ]),
    );

    await page.goto("/jobs");
    await page
      .getByPlaceholder("Search titles and companies...")
      .first()
      .fill("개발자");
    await page.keyboard.press("Enter");

    await expect(page.getByText("소프트웨어 개발자")).toBeVisible();
    await expect(page.getByText("한국 회사")).toBeVisible();
    await expect(page.getByText("Error loading jobs")).not.toBeVisible();
  });

  test("API error shows error message", async ({ page }) => {
    await page.route("**/api/v1/jobs/**", (route) => {
      route.fulfill({ status: 500, body: "Internal Server Error" });
    });

    await page.goto("/jobs");
    await page
      .getByPlaceholder("Search titles and companies...")
      .first()
      .fill("engineer");
    await page.keyboard.press("Enter");

    await expect(page.getByText("Error loading jobs")).toBeVisible();
  });
});
