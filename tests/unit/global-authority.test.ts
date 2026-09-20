import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GlobalAuthorityError,
  requireGlobalAdmin,
} from "../../src/app/api/server/user-administration/global-authority";

const principal = {
  id: "user-1",
  firstName: "Ana",
  lastName: "Silva",
  image: "",
  isAdmin: false,
} as const;

describe("global administration authority", () => {
  it("accepts only the canonical ADMIN role", () => {
    const admin = { ...principal, role: "ADMIN" as const };
    assert.equal(requireGlobalAdmin(admin), admin);
  });

  it("does not grant authority from the legacy isAdmin flag", () => {
    assert.throws(
      () => requireGlobalAdmin({ ...principal, isAdmin: true, role: "USER" }),
      (error) =>
        error instanceof GlobalAuthorityError &&
        error.code === "ADMIN_AUTHORITY_REQUIRED",
    );
  });

  it("denies every non-admin global role", () => {
    for (const role of ["USER", "DEVELOPER", "MODERATOR"] as const) {
      assert.throws(() => requireGlobalAdmin({ ...principal, role }));
    }
  });
});
