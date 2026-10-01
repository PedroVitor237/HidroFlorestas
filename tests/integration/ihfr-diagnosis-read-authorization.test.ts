import assert from "node:assert/strict";
import { test } from "node:test";
import { assertLaboratoryPermission } from "../../src/app/api/server/areas/area.authorization";

test("OWNER, contextual ADMIN and MEMBER may read even when laboratory is inactive", () => {
  for (const role of ["OWNER", "ADMIN", "MEMBER"] as const) {
    assert.doesNotThrow(() => assertLaboratoryPermission(role, true, "READ_ENVIRONMENTAL_DATA"));
    assert.doesNotThrow(() => assertLaboratoryPermission(role, false, "READ_ENVIRONMENTAL_DATA"));
  }
});
