import { defineConfig, devices } from "@playwright/test";

const configuredBaseUrl = process.env.PLAYWRIGHT_BASE_URL
  ?.trim()
  .replace(/\/+$/u, "");
const requestedPort = Number.parseInt(
  process.env.PLAYWRIGHT_PORT ?? "3104",
  10,
);
const port =
  Number.isInteger(requestedPort) && requestedPort > 0
    ? requestedPort
    : 3104;
const localBaseUrl = `http://127.0.0.1:${port}`;
const baseURL = configuredBaseUrl || localBaseUrl;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["line"],
    [
      "html",
      {
        open: "never",
        outputFolder: "output/playwright-report",
      },
    ],
  ],
  outputDir: "output/playwright-results",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
      },
    },
  ],
  webServer: configuredBaseUrl
    ? undefined
    : {
        command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
        env: {
          FONDATION_ALLOWED_HOSTS: "fondation.example.test",
          FONDATION_ORDER_INTAKE_TOKEN:
            "playwright-fondation-token-0000000000000000",
          FONDATION_PROPOSAL_INTAKE_URL:
            "https://fondation.example.test/api/public/proposals",
          VITRINE_ENABLE_PROPOSALS: "true",
          VITRINE_PRIVACY_CONTACT_EMAIL:
            "confidentialite@example.test",
          VITRINE_PRIVACY_OFFICER_NAME:
            "Responsable vie privée Playwright",
          VITRINE_PROPOSAL_RETENTION_DAYS: "365",
        },
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: `${localBaseUrl}/healthz`,
      },
});
