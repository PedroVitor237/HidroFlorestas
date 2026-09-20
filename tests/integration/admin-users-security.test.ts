import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { administrationError, administrationJson } from "../../src/app/api/server/user-administration/user-administration.http";

const forbidden = ["password", "passwordHash", "token", "isAdmin", "private database detail"];
function assertSafe(value: unknown) { const serialized = JSON.stringify(value); for (const field of forbidden) assert.equal(serialized.includes(field), false, `leaked ${field}`); }

describe("admin response security", () => {
  it("keeps user, audit and error payloads allowlisted", async () => {
    const user = { id: "user-2", firstName: "Bia", lastName: "Pessoa", email: "bia@example.test", role: "USER", status: "ACTIVE", revision: 2, createdAt: "2026-09-19T12:00:00.000Z", updatedAt: "2026-09-19T12:00:00.000Z" };
    const event = { id: "event-1", targetUserId: "user-2", actorUserId: "admin-1", action: "GLOBAL_ROLE_CHANGED", beforeValue: "USER", afterValue: "ADMIN", reason: "promoção", targetRevision: 3, createdAt: "2026-09-19T12:00:00.000Z" };
    assertSafe(await administrationJson({ items: [user], nextCursor: null }).json());
    assertSafe(await administrationJson({ items: [event], nextCursor: null }).json());
    assertSafe(await administrationError(new Error("private database detail")).json());
  });
});
