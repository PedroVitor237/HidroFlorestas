import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { UserAdministrationService } from "../../src/app/api/server/services/user-administration.service";
import { UserAdministrationError } from "../../src/app/api/server/user-administration/user-administration.contracts";
import { administrationFixtureId, createAdministrationClient, setupAdministrationFixtures } from "../fixtures/user-administration";

test("one request wins each account revision and mutation/audit remain atomic", async () => {
  const db = createAdministrationClient();
  try {
    await setupAdministrationFixtures(db);
    const service = new UserAdministrationService(db);
    const actor = administrationFixtureId(1);
    const target = administrationFixtureId(5);
    const marker = randomUUID();
    const reasons = [`${marker} a`, `${marker} b`];
    const results = await Promise.allSettled([
      service.changeStatus(actor, target, { expectedStatus: "ACTIVE", expectedRevision: 0, status: "BLOCKED", reason: reasons[0] }),
      service.changeStatus(actor, target, { expectedStatus: "ACTIVE", expectedRevision: 0, status: "INACTIVE", reason: reasons[1] }),
    ]);
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
    const rejection = results.find((result) => result.status === "rejected") as PromiseRejectedResult;
    assert.ok(rejection.reason instanceof UserAdministrationError);
    assert.match(rejection.reason.code, /STALE_REVISION|EXPECTED_STATE_MISMATCH/);
    const current = await db.user.findUniqueOrThrow({ where: { id: target } });
    const events = await db.administrativeAuditEvent.count({ where: { targetUserId: target, reason: { in: reasons } } });
    assert.equal(current.revision, 1);
    assert.equal(events, 1);
  } finally { await db.$disconnect(); }
});
