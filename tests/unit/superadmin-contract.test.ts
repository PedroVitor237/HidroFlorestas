import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";

const source = readFileSync("src/app/api/server/scripts/superadmin.ts", "utf8");

it("provisions canonical ACTIVE+ADMIN authority and stops after an invalid root key", () => {
  assert.match(source, /if \(rootPass !== ROOT_PASS\)[\s\S]*return;/);
  assert.match(source, /role: 'ADMIN'/);
  assert.match(source, /status: 'ACTIVE'/);
  assert.doesNotMatch(source, /isAdmin/);
});
