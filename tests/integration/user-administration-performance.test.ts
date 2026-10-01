import assert from "node:assert/strict";
import { test } from "node:test";
import { performance } from "node:perf_hooks";
import { UserAdministrationService } from "../../src/app/api/server/services/user-administration.service";
import { administrationFixtureId, createAdministrationClient, setupAdministrationFixtures } from "../fixtures/user-administration";

test("p95 for an allowlisted page of 50 synthetic accounts stays below two seconds", async () => {
  const db = createAdministrationClient();
  try {
    await setupAdministrationFixtures(db);
    const service = new UserAdministrationService(db);
    const samples: number[] = [];
    for (let index = 0; index < 20; index += 1) {
      const started = performance.now();
      const result = await service.list(administrationFixtureId(1), { search: "IMP009", limit: 50 });
      samples.push(performance.now() - started);
      assert.equal(result.items.length, 50);
    }
    samples.sort((a, b) => a - b);
    assert.ok(samples[Math.ceil(samples.length * 0.95) - 1] < 2_000);
  } finally { await db.$disconnect(); }
});
