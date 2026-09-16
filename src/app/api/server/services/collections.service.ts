import { Prisma, type PrismaClient } from "@/generated/prisma";
import type { CollectionDetailDto } from "@/types/collection.type";
import { AreaAccessError, authorizeLaboratoryAccess, type LaboratoryContext } from "../areas/area.authorization";
import { serializeCollectionDetail, type ParsedCollectionOccurrence } from "../collections/collection.contracts";
import { prisma } from "../lib/prisma";

export type CollectionRecord = {
  id: string;
  collectionAreaId: string;
  laboratoryRoomId: string;
  userId: string;
  occurredAt: Date;
  occurrenceOffset: string;
  confirmedAt: Date;
  confirmationKey: string;
  area: { id: string; name: string };
  laboratory: { id: string; name: string; isActive: boolean };
};

export type CollectionTransaction = {
  raw?: Prisma.TransactionClient;
  findByKey(userId: string, confirmationKey: string): Promise<CollectionRecord | null>;
  findArea(areaId: string, laboratoryId: string): Promise<{ id: string; name: string } | null>;
  create(data: Omit<CollectionRecord, "area" | "laboratory">): Promise<CollectionRecord>;
};

export type CollectionStore = {
  transaction<T>(operation: (transaction: CollectionTransaction) => Promise<T>): Promise<T>;
};

export type CollectionAuthorization = (
  userId: string,
  laboratoryId: string,
  transaction: CollectionTransaction,
) => Promise<LaboratoryContext>;

export type CreateCollectionCommand = {
  userId: string;
  laboratoryId: string;
  areaId: string;
  confirmationKey: string;
  occurrence: ParsedCollectionOccurrence;
};

export type CreateCollectionResult = { created: boolean; collection: CollectionDetailDto };

export type CollectionsServiceDependencies = {
  store: CollectionStore;
  authorize: CollectionAuthorization;
  clock: () => Date;
  createId: () => string;
};

export class CollectionServiceError extends Error {
  constructor(public readonly code: "NOT_IMPLEMENTED" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR") {
    super(code);
    this.name = "CollectionServiceError";
  }
}

function occurrenceAtOffset(instant: Date, offset: string) {
  if (offset === "Z") return instant.toISOString();
  const sign = offset[0] === "+" ? 1 : -1;
  const minutes = Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6));
  return `${new Date(instant.getTime() + sign * minutes * 60_000).toISOString().slice(0, -1)}${offset}`;
}

function toDetail(record: CollectionRecord, context: LaboratoryContext) {
  return serializeCollectionDetail({
    id: record.id,
    occurredAt: occurrenceAtOffset(record.occurredAt, record.occurrenceOffset),
    confirmedAt: record.confirmedAt,
    area: record.area,
    laboratory: { id: context.id, name: context.name, status: context.status },
    readOnly: context.readOnly,
  });
}

function sameTuple(record: CollectionRecord, command: CreateCollectionCommand) {
  return record.laboratoryRoomId === command.laboratoryId &&
    record.collectionAreaId === command.areaId &&
    record.occurredAt.getTime() === command.occurrence.occurredAtUtc.getTime() &&
    record.occurrenceOffset === command.occurrence.occurrenceOffset;
}

function retryable(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error &&
    ["P2002", "P2034"].includes(String(error.code)));
}

export class CollectionsService {
  constructor(private readonly dependencies: CollectionsServiceDependencies) {}

  async create(command: CreateCollectionCommand): Promise<CreateCollectionResult> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await this.dependencies.store.transaction(async (transaction) => {
          const context = await this.dependencies.authorize(command.userId, command.laboratoryId, transaction);
          const area = await transaction.findArea(command.areaId, command.laboratoryId);
          if (!area) throw new CollectionServiceError("NOT_FOUND");
          const existing = await transaction.findByKey(command.userId, command.confirmationKey);
          if (existing) {
            if (!sameTuple(existing, command)) throw new CollectionServiceError("CONFLICT");
            return { created: false, collection: toDetail(existing, context) };
          }
          const record = await transaction.create({
            id: this.dependencies.createId(),
            userId: command.userId,
            laboratoryRoomId: command.laboratoryId,
            collectionAreaId: command.areaId,
            occurredAt: command.occurrence.occurredAtUtc,
            occurrenceOffset: command.occurrence.occurrenceOffset,
            confirmedAt: this.dependencies.clock(),
            confirmationKey: command.confirmationKey,
          });
          return { created: true, collection: toDetail(record, context) };
        });
      } catch (error) {
        if (error instanceof AreaAccessError || error instanceof CollectionServiceError) throw error;
        if (retryable(error) && attempt === 0) continue;
        throw new CollectionServiceError("INTERNAL_ERROR");
      }
    }
    throw new CollectionServiceError("INTERNAL_ERROR");
  }
}

const recordSelection = {
  id: true,
  collectionAreaId: true,
  laboratoryRoomId: true,
  userId: true,
  occurredAt: true,
  occurrenceOffset: true,
  confirmedAt: true,
  confirmationKey: true,
  collectionArea: { select: { id: true, name: true } },
  laboratoryRoom: { select: { id: true, name: true, isActive: true } },
} satisfies Prisma.CollectionDataSelect;

type SelectedRecord = Prisma.CollectionDataGetPayload<{ select: typeof recordSelection }>;

function completeRecord(value: SelectedRecord): CollectionRecord {
  if (!value.occurredAt || !value.occurrenceOffset || !value.confirmedAt || !value.confirmationKey) {
    throw new CollectionServiceError("INTERNAL_ERROR");
  }
  return {
    id: value.id,
    collectionAreaId: value.collectionAreaId,
    laboratoryRoomId: value.laboratoryRoomId,
    userId: value.userId,
    occurredAt: value.occurredAt,
    occurrenceOffset: value.occurrenceOffset,
    confirmedAt: value.confirmedAt,
    confirmationKey: value.confirmationKey,
    area: value.collectionArea,
    laboratory: value.laboratoryRoom,
  };
}

export class PrismaCollectionStore implements CollectionStore {
  constructor(private readonly db: PrismaClient = prisma) {}

  transaction<T>(operation: (transaction: CollectionTransaction) => Promise<T>) {
    return this.db.$transaction(async (raw) => operation({
      raw,
      async findByKey(userId, confirmationKey) {
        const found = await raw.collectionData.findUnique({
          where: { userId_confirmationKey: { userId, confirmationKey } },
          select: recordSelection,
        });
        return found ? completeRecord(found) : null;
      },
      async findArea(areaId, laboratoryId) {
        return raw.collectionArea.findFirst({
          where: { id: areaId, laboratoryRoomId: laboratoryId },
          select: { id: true, name: true },
        });
      },
      async create(data) {
        return completeRecord(await raw.collectionData.create({ data, select: recordSelection }));
      },
    }), { isolationLevel: "Serializable", maxWait: 15_000, timeout: 30_000 });
  }
}

export const collectionsService = new CollectionsService({
  store: new PrismaCollectionStore(),
  authorize: async (userId, laboratoryId, transaction) => {
    if (!transaction.raw) throw new CollectionServiceError("INTERNAL_ERROR");
    return authorizeLaboratoryAccess(
      { id: userId }, laboratoryId, "CREATE_COLLECTION", transaction.raw, true,
    );
  },
  clock: () => new Date(),
  createId: () => crypto.randomUUID(),
});
