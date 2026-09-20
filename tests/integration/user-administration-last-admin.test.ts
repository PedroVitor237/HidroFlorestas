import assert from "node:assert/strict";
import { test } from "node:test";
import { UserAdministrationService } from "../../src/app/api/server/services/user-administration.service";
import { administrationFixtureId, createAdministrationClient, setupAdministrationFixtures } from "../fixtures/user-administration";

test("concurrent changes never remove both final ACTIVE ADMIN accounts", async () => {
  const db = createAdministrationClient();
  try {
    await setupAdministrationFixtures(db);
    const service = new UserAdministrationService(db);
    const first = administrationFixtureId(1), second = administrationFixtureId(2);
    const results = await Promise.allSettled([
      service.changeRole(first, second, { expectedRole: "ADMIN", expectedRevision: 0, role: "USER", reason: "rebalance a" }),
      service.changeRole(second, first, { expectedRole: "ADMIN", expectedRevision: 0, role: "USER", reason: "rebalance b" }),
    ]);
    assert.ok(results.some((result) => result.status === "rejected"));
    assert.equal(await db.user.count({ where: { id: { in: [first, second] }, role: "ADMIN", status: "ACTIVE" } }), 1);
  } finally { await db.$disconnect(); }
});
