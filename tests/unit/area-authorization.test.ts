import assert from "node:assert/strict";
import { it } from "node:test";
import { assertLaboratoryPermission, AreaAccessError, type ContextRole } from "../../src/app/api/server/areas/area.authorization";
it("enforces contextual roles and read-only precedence", () => {
  for (const role of ["OWNER", "ADMIN", "MEMBER"] as ContextRole[]) {
    assert.doesNotThrow(() => assertLaboratoryPermission(role, false, "READ_AREAS"));
    assert.doesNotThrow(() => assertLaboratoryPermission(role, true, "CREATE_COLLECTION", true));
    assert.throws(() => assertLaboratoryPermission(role, false, "CREATE_COLLECTION", true), (e) => e instanceof AreaAccessError && e.code === "READ_ONLY");
    assert.throws(() => assertLaboratoryPermission(role, false, "CREATE_AREA", true), (e) => e instanceof AreaAccessError && e.code === "READ_ONLY");
    if (role === "MEMBER") assert.throws(() => assertLaboratoryPermission(role, true, "CREATE_AREA", true));
    else assert.doesNotThrow(() => assertLaboratoryPermission(role, true, "CREATE_AREA", true));
    if (role !== "OWNER") assert.throws(() => assertLaboratoryPermission(role, true, "MANAGE_ROLES"));
  }
});

it("keeps IHFR management separate from environmental capture permission", () => {
  for (const role of ["OWNER", "ADMIN", "MEMBER"] as ContextRole[]) {
    assert.doesNotThrow(() => assertLaboratoryPermission(role, true, "READ_IHFR_DIAGNOSIS"));
    assert.doesNotThrow(() => assertLaboratoryPermission(role, false, "READ_IHFR_DIAGNOSIS"));
    assert.throws(() => assertLaboratoryPermission(role, false, "MANAGE_IHFR_DIAGNOSIS", true), (error) => error instanceof AreaAccessError && error.code === "READ_ONLY");
    if (role === "MEMBER") {
      assert.doesNotThrow(() => assertLaboratoryPermission(role, true, "CREATE_ENVIRONMENTAL_DATA", true));
      assert.throws(() => assertLaboratoryPermission(role, true, "MANAGE_IHFR_DIAGNOSIS", true), (error) => error instanceof AreaAccessError && error.code === "FORBIDDEN");
    } else {
      assert.doesNotThrow(() => assertLaboratoryPermission(role, true, "MANAGE_IHFR_DIAGNOSIS", true));
    }
  }
});
