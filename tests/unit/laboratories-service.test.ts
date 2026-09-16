import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LaboratoriesService, type LaboratoriesRepository } from "../../src/app/api/server/services/laboratories.service";

const date = new Date("2026-09-07T12:00:00Z");
const source = (name: string, userId = "principal-id") => ({ id: `id-${name}`, name, createdAt: date, isActive: true, userId });
const baseRepository = (): LaboratoriesRepository => ({
  listAccessible: async () => [], createAtomic: async () => ({ kind: "LIMIT_REACHED" }), getDetails: async () => null,
  deactivate: async () => "NOT_FOUND", delete: async () => "NOT_FOUND",
});

describe("LaboratoriesService", () => {
  it("creates for the authenticated id and allows repeated names", async () => {
    const calls: unknown[][] = [];
    const repository: LaboratoriesRepository = {
      ...baseRepository(),
      createAtomic: async (...args) => { calls.push(args); return { kind: "CREATED", laboratory: source(args[1]) }; },
    };
    const service = new LaboratoriesService(repository, () => "generated-code");
    assert.equal((await service.create("principal-id", "Same")).success, true);
    assert.equal((await service.create("principal-id", "Same")).success, true);
    assert.deepEqual(calls, [["principal-id", "Same", "generated-code"], ["principal-id", "Same", "generated-code"]]);
  });

  it("returns the five-link limit without a public write", async () => {
    const repository: LaboratoriesRepository = baseRepository();
    assert.deepEqual(await new LaboratoriesService(repository).create("user", "Lab"), { success: false, reason: "LIMIT_REACHED" });
  });

  it("retries serializable/unique conflicts and controls final failures", async () => {
    let attempts = 0;
    const repository: LaboratoriesRepository = {
      ...baseRepository(),
      createAtomic: async () => { attempts += 1; if (attempts < 3) throw { code: attempts === 1 ? "P2002" : "P2034" }; return { kind: "CREATED", laboratory: source("Lab") }; },
    };
    assert.equal((await new LaboratoriesService(repository).create("user", "Lab")).success, true);
    assert.equal(attempts, 3);
    repository.createAtomic = async () => { throw new Error("database detail"); };
    assert.deepEqual(await new LaboratoriesService(repository).create("user", "Lab"), { success: false, reason: "INTERNAL_ERROR" });
  });

  it("lists only repository-scoped records and returns public DTOs", async () => {
    const seen: string[] = [];
    const repository: LaboratoriesRepository = { ...baseRepository(), listAccessible: async (userId) => { seen.push(userId); return [source("A", "principal-only")]; } };
    const result = await new LaboratoriesService(repository).listAccessible("principal-only");
    assert.deepEqual(seen, ["principal-only"]);
    assert.deepEqual(result, { success: true, laboratories: [{ id: "id-A", name: "A", createdAt: date.toISOString(), status: "ACTIVE", isOwner: true }] });
  });

  it("shows member initials and restricts destructive actions through repository results", async () => {
    const repository = baseRepository();
    repository.getDetails = async () => ({ ...source("Lab"), members: [{ firstName: "Ana", lastName: "Silva" }, { firstName: "João", lastName: "" }] });
    repository.deactivate = async (_userId, _laboratoryId, confirmation) => confirmation === "Lab" ? "DEACTIVATED" : "MISMATCH";
    repository.delete = async () => "HAS_DATA";
    const service = new LaboratoriesService(repository);
    assert.deepEqual(await service.details("principal-id", "id-Lab"), { success: true, details: { id: "id-Lab", name: "Lab", createdAt: date.toISOString(), status: "ACTIVE", isOwner: true, members: [{ name: "Ana Silva", initials: "AS" }, { name: "João", initials: "J" }] } });
    assert.deepEqual(await service.deactivate("principal-id", "id-Lab", "wrong"), { success: false, reason: "CONFIRMATION_MISMATCH" });
    assert.deepEqual(await service.delete("principal-id", "id-Lab", "Lab"), { success: false, reason: "LABORATORY_HAS_DATA" });
  });

  it("keeps administrative deletion blocked when persisted collection data exists", async () => {
    const repository = baseRepository();
    repository.delete = async () => "HAS_DATA";
    const result = await new LaboratoriesService(repository).delete("owner", "laboratory", "Laboratory");
    assert.deepEqual(result, { success: false, reason: "LABORATORY_HAS_DATA" });
  });
});
