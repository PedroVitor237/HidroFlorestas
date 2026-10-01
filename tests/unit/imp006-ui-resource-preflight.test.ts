import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { assertResourceSnapshot, requireBrowserExecutable, resourceThreshold } from "../../scripts/imp006-ui-resource-preflight";

test("full UI resource threshold has a bounded configurable margin", () => {
  assert.equal(resourceThreshold(undefined), 4);
  assert.equal(resourceThreshold("6"), 6);
  assert.throws(() => resourceThreshold("0"), /between 1 and 100/);
  assert.throws(() => resourceThreshold("NaN"), /between 1 and 100/);
});

test("full UI resource guard distinguishes disk and inode shortage", () => {
  assert.throws(() => assertResourceSnapshot("owned-temp", 1024 ** 3, 10_000, 4), /UI_RESOURCE_DISK_LOW/);
  assert.throws(() => assertResourceSnapshot("owned-temp", 5 * 1024 ** 3, 10, 4), /UI_RESOURCE_INODES_LOW/);
  assert.doesNotThrow(() => assertResourceSnapshot("owned-temp", 5 * 1024 ** 3, 0, 4));
});

test("full UI resource guard refuses a missing browser before a domain write", async () => {
  await assert.rejects(requireBrowserExecutable(join(tmpdir(), `missing-playwright-${randomUUID()}`)), /UI_RESOURCE_BROWSER_MISSING/);
  await assert.doesNotReject(requireBrowserExecutable(process.execPath));
});
