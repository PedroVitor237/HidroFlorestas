import assert from "node:assert/strict";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { GlobalAuthorityError } from "../../src/app/api/server/user-administration/global-authority";
import { UserAdministrationError } from "../../src/app/api/server/user-administration/user-administration.contracts";

export const routeAdmin = { id: "admin-1", firstName: "Ada", lastName: "Admin", image: "", role: "ADMIN" as const };
export const routeUser = { id: "user-2", firstName: "Bia", lastName: "Pessoa", email: "bia@example.test", role: "USER", status: "ACTIVE", revision: 2, createdAt: "2026-09-19T12:00:00.000Z", updatedAt: "2026-09-19T12:00:00.000Z" } as const;
export const context = { params: Promise.resolve({ userId: routeUser.id }) };

export const controlledFailures = [
  [new AuthBoundaryError("UNAUTHORIZED"), 401, "UNAUTHENTICATED"],
  [new GlobalAuthorityError("ADMIN_AUTHORITY_REQUIRED"), 403, "ADMIN_AUTHORITY_REQUIRED"],
  [new UserAdministrationError("USER_NOT_FOUND"), 404, "USER_NOT_FOUND"],
  [new UserAdministrationError("STALE_REVISION", 4), 409, "STALE_REVISION"],
  [new Error("private database detail"), 500, "INTERNAL_ERROR"],
] as const;

export async function assertControlled(response: Response, status: number, code: string) {
  const body = await response.json();
  assert.equal(response.status, status);
  assert.equal(body.error.code, code);
  assert.equal(JSON.stringify(body).includes("private database detail"), false);
}
