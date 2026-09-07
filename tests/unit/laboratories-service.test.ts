import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LaboratoriesService, type LaboratoriesRepository } from "../../src/app/api/server/services/laboratories.service";

const date = new Date("2026-09-07T12:00:00Z");
const source = (name: string) => ({ name, createdAt: date, isActive: true });

describe("LaboratoriesService", () => {
  it("creates for the authenticated id and allows repeated names", async () => {
    const calls: unknown[][] = [];
    const repository: LaboratoriesRepository = {
      listAccessible: async () => [],
      createAtomic: async (...args) => { calls.push(args); return { kind: "CREATED", laboratory: source(args[1]) }; },
    };
    const service = new LaboratoriesService(repository, () => "generated-code");
    assert.equal((await service.create("principal-id", "Same")).success, true);
    assert.equal((await service.create("principal-id", "Same")).success, true);
    assert.deepEqual(calls, [["principal-id", "Same", "generated-code"], ["principal-id", "Same", "generated-code"]]);
  });

  it("returns the five-link limit without a public write", async () => {
    const repository: LaboratoriesRepository = { listAccessible: async () => [], createAtomic: async () => ({ kind: "LIMIT_REACHED" }) };
    assert.deepEqual(await new LaboratoriesService(repository).create("user", "Lab"), { success: false, reason: "LIMIT_REACHED" });
  });

  it("retries serializable/unique conflicts and controls final failures", async () => {
    let attempts = 0;
    const repository: LaboratoriesRepository = {
      listAccessible: async () => [],
      createAtomic: async () => { attempts += 1; if (attempts < 3) throw { code: attempts === 1 ? "P2002" : "P2034" }; return { kind: "CREATED", laboratory: source("Lab") }; },
    };
    assert.equal((await new LaboratoriesService(repository).create("user", "Lab")).success, true);
    assert.equal(attempts, 3);
    repository.createAtomic = async () => { throw new Error("database detail"); };
    assert.deepEqual(await new LaboratoriesService(repository).create("user", "Lab"), { success: false, reason: "INTERNAL_ERROR" });
  });

  it("lists only repository-scoped records and returns public DTOs", async () => {
    const seen: string[] = [];
    const repository: LaboratoriesRepository = { listAccessible: async (userId) => { seen.push(userId); return [source("A")]; }, createAtomic: async () => ({ kind: "LIMIT_REACHED" }) };
    const result = await new LaboratoriesService(repository).listAccessible("principal-only");
    assert.deepEqual(seen, ["principal-only"]);
    assert.deepEqual(result, { success: true, laboratories: [{ name: "A", createdAt: date.toISOString(), status: "ACTIVE" }] });
  });
});
