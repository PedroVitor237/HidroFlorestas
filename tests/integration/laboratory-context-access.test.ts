import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  AreaAccessError,
  authorizeLaboratoryAccess,
} from "../../src/app/api/server/areas/area.authorization";

const principal = { id: "00000000-0000-4000-8000-000000000001" };
const laboratoryId = "00000000-0000-4000-8000-000000000011";

function database(options: {
  status?: "ACTIVE" | "BLOCKED";
  linked?: boolean;
  active?: boolean;
  role?: "OWNER" | "ADMIN" | "MEMBER";
} = {}) {
  let membershipReads = 0;
  const db = {
    user: {
      findUnique: async () => ({ status: options.status ?? "ACTIVE" }),
    },
    researchersLinked: {
      findUnique: async ({ where }: { where: unknown }) => {
        membershipReads += 1;
        assert.deepEqual(where, {
          userId_laboratoryRoomId: { userId: principal.id, laboratoryRoomId: laboratoryId },
        });
        if (options.linked === false) return null;
        return {
          role: options.role ?? "OWNER",
          laboratoryRoom: {
            id: laboratoryId,
            name: "Laboratório contextual",
            isActive: options.active ?? true,
          },
        };
      },
    },
  };
  return { db, membershipReads: () => membershipReads };
}

describe("laboratory context access", () => {
  it("returns current context and revalidates membership on every call", async () => {
    const fixture = database();
    const first = await authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", fixture.db as never);
    const second = await authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", fixture.db as never);
    assert.deepEqual(first, {
      id: laboratoryId,
      name: "Laboratório contextual",
      status: "ACTIVE",
      membershipRole: "OWNER",
      readOnly: false,
    });
    assert.deepEqual(second, first);
    assert.equal(fixture.membershipReads(), 2);
  });

  it("represents an inactive linked laboratory as read-only", async () => {
    const fixture = database({ active: false, role: "MEMBER" });
    const context = await authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", fixture.db as never);
    assert.equal(context.readOnly, true);
    assert.equal(context.status, "INACTIVE");
  });

  it("uses the same not-found result for invalid, missing and revoked access", async () => {
    await assert.rejects(
      authorizeLaboratoryAccess(principal, "invalid", "READ_AREAS", database().db as never),
      (error) => error instanceof AreaAccessError && error.code === "NOT_FOUND",
    );
    await assert.rejects(
      authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", database({ linked: false }).db as never),
      (error) => error instanceof AreaAccessError && error.code === "NOT_FOUND",
    );
  });

  it("checks account eligibility before revealing membership", async () => {
    const fixture = database({ status: "BLOCKED" });
    await assert.rejects(
      authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", fixture.db as never),
      (error) => error instanceof AreaAccessError && error.code === "UNAUTHENTICATED",
    );
    assert.equal(fixture.membershipReads(), 0);
  });
});
