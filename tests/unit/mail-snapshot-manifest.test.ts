import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { isMailSnapshotPath, mailSnapshotFingerprint, mailSnapshotManifest } from "../../scripts/mail-validation-diagnostics";

test("validation manifest includes runtime/build configs and excludes private and generated artifacts", async () => {
  for (const path of ["next.config.ts", "prisma.config.ts", "postcss.config.mjs", "tailwind.config.ts", "components.json", ".vercelignore", "vercel.json", "playwright.imp006-full-ui.config.ts", "prisma/migrations/20261004000300_account_rate_limit_actions/migration.sql"]) assert.equal(isMailSnapshotPath(path), true, path);
  for (const path of [".env", ".env.test.local", "src/.env.private", ".accounts-validation/build.log", "scripts/private.clixml", "scripts/backup.zip", ".specify/memory/constitution.md", "tsconfig.tsbuildinfo"]) assert.equal(isMailSnapshotPath(path), false, path);
  const manifest = await mailSnapshotManifest(), paths = manifest.map((entry) => entry.path);
  assert.deepEqual(paths, [...new Set(paths)].sort());
  for (const required of ["next.config.ts", "prisma.config.ts", "postcss.config.mjs", "playwright.imp006.config.ts", ".vercelignore"]) assert.equal(paths.includes(required), true, required);
  assert.equal(manifest.every((entry) => /^[0-9a-f]{64}$/.test(entry.sha256)), true);
  assert.equal(await mailSnapshotFingerprint(), createHash("sha256").update(JSON.stringify(manifest)).digest("hex"));
});
