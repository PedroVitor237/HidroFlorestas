import type { Page } from "@playwright/test";

/** Fill the friendly controls while retaining the fixture's explicit offset. */
export async function fillCollectionOccurrence(page: Page, occurredAt: string) {
  const match = /^(.*)([+-]\d{2}:\d{2}|Z)$/.exec(occurredAt);
  if (!match) throw new Error("Fixture requires RFC 3339 occurrence with offset");
  await page.getByLabel("Fuso da coleta").selectOption("manual");
  await page.getByLabel("Offset UTC").fill(match[2] === "Z" ? "+00:00" : match[2]);
  // Chromium canonicalizes zero seconds in datetime-local; Playwright fill compares
  // strings exactly. Use the equivalent browser value, preserving offset/fractions.
  const browserLocal = match[1].replace(/(T[0-9]{2}:[0-9]{2}):00$/, "$1");
  await page.getByLabel("Data e hora da coleta").fill(browserLocal);
}
