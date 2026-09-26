import assert from "node:assert/strict";
import { test } from "node:test";
import { imp006AuditExitCode, parseImp006AuditMode } from "../../scripts/imp006-audit-policy";

test("IMP-006 audit modes reject ambiguous commands", () => {
  assert.equal(parseImp006AuditMode([]), "list");
  assert.equal(parseImp006AuditMode(["list"]), "list");
  assert.equal(parseImp006AuditMode(["assert-zero"]), "assert-zero");
  assert.throws(() => parseImp006AuditMode(["cleanup"]));
  assert.throws(() => parseImp006AuditMode(["list", "assert-zero"]));
});

test("IMP-006 audit reports candidates while assert-zero fails closed", () => {
  assert.equal(imp006AuditExitCode("list", 1), 0);
  assert.equal(imp006AuditExitCode("assert-zero", 1), 1);
  assert.equal(imp006AuditExitCode("assert-zero", 0), 0);
  assert.throws(() => imp006AuditExitCode("assert-zero", -1));
});
