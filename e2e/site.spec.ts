import { expect, test } from "@playwright/test";

test("loads the public homepage and navigates to the module catalogue", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Le chantier sous contrôle/u,
    }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Explorer les modules", exact: true })
    .click();

  await expect(page).toHaveURL(/\/modules$/u);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Choisissez un flux métier/u,
    }),
  ).toBeVisible();
});

test("opens the mobile navigation and follows a primary link", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");

  await page.goto("/");
  await page.locator('summary[aria-label="Ouvrir le menu"]').click();

  const navigation = page.getByRole("navigation", {
    name: "Navigation mobile",
  });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Tarifs", exact: true }).click();

  await expect(page).toHaveURL(/\/tarifs$/u);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Un point de départ clair/u,
    }),
  ).toBeVisible();
});

test("validates and submits the proposal form without a real backend write", async ({
  page,
}) => {
  await page.route("**/api/proposals", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        reference: "pro-e2e-0001",
        safeError: null,
        safeSummary: "Demande de test reçue.",
        status: "accepted",
      }),
      contentType: "application/json",
      status: 202,
    });
  });

  await page.goto("/commander?plan=croissance");

  const teamSize = page.locator('select[name="teamSize"]');
  const priority = page.locator('select[name="priority"]');
  await page.getByRole("button", { name: "Continuer" }).click();
  await expect(teamSize).toHaveAttribute("aria-invalid", "true");
  await expect(teamSize).toBeFocused();

  await teamSize.selectOption("6-15");
  await priority.selectOption("projects");
  await page.getByRole("button", { name: "Continuer" }).click();

  const company = page.locator('input[name="companyName"]');
  await page
    .getByRole("button", { name: "Préparer ma proposition" })
    .click();
  await expect(company).toHaveAttribute("aria-invalid", "true");
  await expect(company).toBeFocused();

  await company.fill("Construction E2E");
  await page.locator('input[name="contactName"]').fill("Marie Test");
  await page.locator('input[name="email"]').fill("marie@example.test");
  await page.locator('input[name="acceptsContact"]').check();

  await page
    .getByRole("button", { name: "Préparer ma proposition" })
    .click();

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Le contexte de départ est prêt.",
    }),
  ).toBeVisible();
  await expect(page.getByText("pro-e2e-0001")).toBeVisible();
});

test("serves the production security header baseline", async ({ request }) => {
  const response = await request.get("/");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-security-policy"]).toContain(
    "default-src 'self'",
  );
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["strict-transport-security"]).toContain(
    "max-age=31536000",
  );
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
});

test("keeps direct checkout closed without a signed quote", async ({ page }) => {
  await page.goto("/commander/achat");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Commencer par une proposition approuvée.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Le checkout direct n’est pas ouvert.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Commander ProJD" }),
  ).toHaveCount(0);
});

test("keeps the skip link and proposal steps operable by keyboard", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium");

  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenu$/u);

  await page.goto("/commander");
  const teamSize = page.locator('select[name="teamSize"]');
  const priority = page.locator('select[name="priority"]');
  await teamSize.focus();
  await page.keyboard.press("ArrowDown");
  await priority.focus();
  await page.keyboard.press("ArrowDown");

  const continueButton = page.getByRole("button", { name: "Continuer" });
  await continueButton.focus();
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Où transmettre le suivi.",
    }),
  ).toBeVisible();
  await expect(page.locator('input[name="companyName"]')).toBeFocused();
});
