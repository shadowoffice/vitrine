import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  {
    label: "accueil",
    path: "/",
  },
  {
    label: "tarifs",
    path: "/tarifs",
  },
  {
    label: "proposition",
    path: "/commander",
  },
] as const;

for (const route of routes) {
  test(`has no serious or critical automated WCAG violations on ${route.label}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");

    await page.goto(route.path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const blockingViolations = result.violations
      .filter(
        (violation) =>
          violation.impact === "serious" ||
          violation.impact === "critical",
      )
      .map((violation) => ({
        help: violation.help,
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.flatMap((node) => node.target),
      }));

    expect(
      blockingViolations,
      `Violations axe sur ${route.path}: ${JSON.stringify(blockingViolations)}`,
    ).toEqual([]);
  });
}
