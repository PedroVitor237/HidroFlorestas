import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AreaAccessError, type ContextRole } from "../../src/app/api/server/areas/area.authorization";
import {
  CollectionsService,
  CollectionServiceError,
  type CollectionRecord,
  type CollectionTransaction,
} from "../../src/app/api/server/services/collections.service";

const ids = {
  user: "00000000-0000-4000-8000-000000000401",
  otherUser: "00000000-0000-4000-8000-000000000402",
  laboratory: "00000000-0000-4000-8000-000000000411",
  area: "00000000-0000-4000-8000-000000000421",
  collection: "00000000-0000-4000-8000-000000000431",
  key: "40000000-0000-4000-8000-000000000431",
};

const occurrence = {
  occurredAtUtc: new Date("2026-09-15T12:00:00.000Z"),
  occurrenceOffset: "-03:00",
  occurredAt: "2026-09-15T09:00:00.000-03:00",
};

function harness(options: { role?: ContextRole; active?: boolean; area?: boolean; records?: CollectionRecord[] } = {}) {
  const events: string[] = [];
  const records = options.records ?? [];
  const transaction: CollectionTransaction = {
    async findByKey(userId, key) {
      events.push("key");
      return records.find((record) => record.userId === userId && record.confirmationKey === key) ?? null;
    },
    async findArea(areaId, laboratoryId) {
      events.push("area");
      return options.area === false || areaId !== ids.area || laboratoryId !== ids.laboratory
        ? null
        : { id: ids.area, name: "Área" };
    },
    async findDetail(collectionId, areaId, laboratoryId) {
      events.push("detail");
      return records.find((record) =>
        record.id === collectionId && record.collectionAreaId === areaId && record.laboratoryRoomId === laboratoryId) ?? null;
    },
    async create(data) {
      events.push("create");
      const record: CollectionRecord = {
        ...data,
        area: { id: ids.area, name: "Área" },
        laboratory: { id: ids.laboratory, name: "Laboratório", isActive: true },
      };
      records.push(record);
      return record;
    },
  };
  const service = new CollectionsService({
    store: {
      async transaction(operation) {
        events.push("transaction");
        return operation(transaction);
      },
    },
    async authorize(userId, laboratoryId) {
      events.push("authorize");
      assert.equal(userId, ids.user);
      assert.equal(laboratoryId, ids.laboratory);
      return {
        id: ids.laboratory,
        name: "Laboratório",
        status: options.active === false ? "INACTIVE" : "ACTIVE",
        membershipRole: options.role ?? "OWNER",
        readOnly: options.active === false,
      };
    },
    clock: () => new Date("2026-09-15T12:05:00.000Z"),
    createId: () => ids.collection,
  });
  return { service, events, records };
}

const command = {
  userId: ids.user,
  laboratoryId: ids.laboratory,
  areaId: ids.area,
  confirmationKey: ids.key,
  occurrence,
};

describe("collections service creation", () => {
  it("allows each contextual role and derives author, id and confirmation on the server", async () => {
    for (const role of ["OWNER", "ADMIN", "MEMBER"] as const) {
      const { service, events, records } = harness({ role });
      const result = await service.create(command);
      assert.equal(result.created, true);
      assert.deepEqual(events, ["transaction", "authorize", "area", "key", "create"]);
      assert.equal(records[0].userId, ids.user);
      assert.equal(records[0].id, ids.collection);
      assert.equal(records[0].confirmedAt.toISOString(), "2026-09-15T12:05:00.000Z");
      assert.equal(result.collection.occurredAt, occurrence.occurredAt);
      assert.equal(JSON.stringify(result).includes("userId"), false);
    }
  });

  it("rejects a missing or crossed area after authorization and before creation", async () => {
    const { service, events } = harness({ area: false });
    await assert.rejects(() => service.create(command), (error) =>
      error instanceof CollectionServiceError && error.code === "NOT_FOUND");
    assert.deepEqual(events, ["transaction", "authorize", "area"]);
  });

  it("propagates contextual access failures without consulting the area", async () => {
    for (const code of ["UNAUTHENTICATED", "NOT_FOUND", "FORBIDDEN", "READ_ONLY"] as const) {
      const events: string[] = [];
      const service = new CollectionsService({
        store: { transaction: async (operation) => operation({} as CollectionTransaction) },
        authorize: async () => { events.push("authorize"); throw new AreaAccessError(code); },
        clock: () => new Date(),
        createId: () => ids.collection,
      });
      await assert.rejects(() => service.create(command), (error) =>
        error instanceof AreaAccessError && error.code === code);
      assert.deepEqual(events, ["authorize"]);
    }
  });

  it("replays the same normalized tuple without writing and conflicts on divergence", async () => {
    const existing: CollectionRecord = {
      id: ids.collection,
      userId: ids.user,
      laboratoryRoomId: ids.laboratory,
      collectionAreaId: ids.area,
      occurredAt: occurrence.occurredAtUtc,
      occurrenceOffset: occurrence.occurrenceOffset,
      confirmedAt: new Date("2026-09-15T12:05:00.000Z"),
      confirmationKey: ids.key,
      area: { id: ids.area, name: "Área" },
      laboratory: { id: ids.laboratory, name: "Laboratório", isActive: true },
    };
    const replay = harness({ records: [existing] });
    assert.equal((await replay.service.create(command)).created, false);
    assert.equal(replay.events.includes("create"), false);

    const conflict = harness({ records: [{ ...existing, collectionAreaId: "00000000-0000-4000-8000-000000000999" }] });
    await assert.rejects(() => conflict.service.create(command), (error) =>
      error instanceof CollectionServiceError && error.code === "CONFLICT");
  });

  it("keeps idempotency isolated per author and sanitizes unexpected store errors", async () => {
    const { service } = harness({ records: [{
      id: ids.collection,
      userId: ids.otherUser,
      laboratoryRoomId: ids.laboratory,
      collectionAreaId: ids.area,
      occurredAt: occurrence.occurredAtUtc,
      occurrenceOffset: occurrence.occurrenceOffset,
      confirmedAt: new Date(),
      confirmationKey: ids.key,
      area: { id: ids.area, name: "Área" },
      laboratory: { id: ids.laboratory, name: "Laboratório", isActive: true },
    }] });
    assert.equal((await service.create(command)).created, true);

    const failing = new CollectionsService({
      store: { transaction: async () => { throw new Error("database details"); } },
      authorize: async () => { throw new Error("unreachable"); },
      clock: () => new Date(),
      createId: () => ids.collection,
    });
    await assert.rejects(() => failing.create(command), (error) =>
      error instanceof CollectionServiceError && error.code === "INTERNAL_ERROR" && !error.message.includes("database"));
  });
});

describe("collections service detail", () => {
  const record: CollectionRecord = {
    id: ids.collection,
    userId: ids.user,
    laboratoryRoomId: ids.laboratory,
    collectionAreaId: ids.area,
    occurredAt: occurrence.occurredAtUtc,
    occurrenceOffset: occurrence.occurrenceOffset,
    confirmedAt: new Date("2026-09-15T12:05:00.000Z"),
    confirmationKey: ids.key,
    area: { id: ids.area, name: "Área" },
    laboratory: { id: ids.laboratory, name: "Laboratório", isActive: true },
  };

  it("allows every current role in active or inactive laboratories with a minimal DTO", async () => {
    for (const role of ["OWNER", "ADMIN", "MEMBER"] as const) {
      for (const active of [true, false]) {
        const { service, events } = harness({ role, active, records: [record] });
        const result = await service.detail(ids.user, ids.laboratory, ids.area, ids.collection);
        assert.deepEqual(events, ["transaction", "authorize", "detail"]);
        assert.equal(result.collection.readOnly, !active);
        assert.equal(result.collection.occurredAt, occurrence.occurredAt);
        assert.equal(result.collection.confirmedAt, "2026-09-15T12:05:00.000Z");
        for (const forbidden of ["userId", "confirmationKey", "observations", "createdAt", "updatedAt"])
          assert.equal(JSON.stringify(result).includes(forbidden), false);
      }
    }
  });

  it("uses the full laboratory, area and collection tuple and returns uniform not-found", async () => {
    for (const [laboratoryId, areaId, collectionId] of [
      [ids.laboratory, ids.area, "00000000-0000-4000-8000-000000000999"],
      [ids.laboratory, "00000000-0000-4000-8000-000000000999", ids.collection],
    ]) {
      const { service } = harness({ records: [record] });
      await assert.rejects(
        () => service.detail(ids.user, laboratoryId, areaId, collectionId),
        (error) => error instanceof CollectionServiceError && error.code === "NOT_FOUND",
      );
    }
  });

  it("reauthorizes before lookup so revoked and ineligible principals cannot read", async () => {
    for (const code of ["UNAUTHENTICATED", "NOT_FOUND"] as const) {
      let lookedUp = false;
      const service = new CollectionsService({
        store: { transaction: async (operation) => operation({ findDetail: async () => { lookedUp = true; return record; } } as unknown as CollectionTransaction) },
        authorize: async () => { throw new AreaAccessError(code); },
        clock: () => new Date(),
        createId: () => ids.collection,
      });
      await assert.rejects(() => service.detail(ids.user, ids.laboratory, ids.area, ids.collection));
      assert.equal(lookedUp, false);
    }
  });
});
