import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";

const sql = readFileSync(
  "prisma/migrations/20260919000100_user_administration/migration.sql",
  "utf8",
);

it("fails closed on contradictory legacy authority and introduces revisioned audit storage", () => {
  assert.match(sql, /RAISE EXCEPTION/);
  assert.match(sql, /role = 'ADMIN'[\s\S]*"isAdmin" = false/);
  assert.match(sql, /role <> 'ADMIN'[\s\S]*"isAdmin" = true/);
  assert.match(sql, /ADD COLUMN revision INTEGER NOT NULL DEFAULT 0/);
  assert.match(sql, /CREATE TABLE "AdministrativeAuditEvent"/);
  assert.match(sql, /reason VARCHAR\(500\) NOT NULL/);
  assert.match(sql, /imp009_reject_audit_mutation/);
  assert.match(sql, /BEFORE UPDATE OR DELETE/);
});
