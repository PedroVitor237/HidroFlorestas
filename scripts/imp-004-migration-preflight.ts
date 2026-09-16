import { Pool, neonConfig, type PoolClient } from "@neondatabase/serverless";
import ws from "ws";

import { validateAuthFixtureEnvironment } from "../tests/fixtures/auth-users";

export type CollectionMigrationPreflightSnapshot = {
  migrationHistoryAligned: boolean;
  collectionCount: number;
  orphanedAreaCount: number;
  orphanedUserCount: number;
  nonDerivableLaboratoryCount: number;
  divergentLaboratoryCount: number;
  scientificChildCounts: {
    water: number;
    soil: number;
    vegetation: number;
    terrain: number;
    diagnoses: number;
  };
};

export type CollectionMigrationPreflightResult = {
  ok: true;
  counts: Record<string, number>;
};

export class CollectionMigrationPreflightError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "CollectionMigrationPreflightError";
  }
}

const countEntries = (snapshot: CollectionMigrationPreflightSnapshot) => ({
  collections: snapshot.collectionCount,
  water: snapshot.scientificChildCounts.water,
  soil: snapshot.scientificChildCounts.soil,
  vegetation: snapshot.scientificChildCounts.vegetation,
  terrain: snapshot.scientificChildCounts.terrain,
  diagnoses: snapshot.scientificChildCounts.diagnoses,
});

export function evaluateCollectionMigrationPreflight(
  snapshot: CollectionMigrationPreflightSnapshot,
): CollectionMigrationPreflightResult {
  const counts = [
    snapshot.collectionCount,
    snapshot.orphanedAreaCount,
    snapshot.orphanedUserCount,
    snapshot.nonDerivableLaboratoryCount,
    snapshot.divergentLaboratoryCount,
    ...Object.values(snapshot.scientificChildCounts),
  ];
  if (counts.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new CollectionMigrationPreflightError(
      "IMP004_INVALID_PREFLIGHT_SNAPSHOT",
    );
  }
  if (!snapshot.migrationHistoryAligned) {
    throw new CollectionMigrationPreflightError("IMP004_MIGRATION_DRIFT");
  }
  if (snapshot.orphanedAreaCount > 0) {
    throw new CollectionMigrationPreflightError("IMP004_ORPHANED_AREA");
  }
  if (snapshot.orphanedUserCount > 0) {
    throw new CollectionMigrationPreflightError("IMP004_ORPHANED_USER");
  }
  if (snapshot.nonDerivableLaboratoryCount > 0) {
    throw new CollectionMigrationPreflightError(
      "IMP004_LABORATORY_NOT_DERIVABLE",
    );
  }
  if (snapshot.divergentLaboratoryCount > 0) {
    throw new CollectionMigrationPreflightError(
      "IMP004_LABORATORY_DIVERGENCE",
    );
  }
  return { ok: true, counts: countEntries(snapshot) };
}

async function scalarCount(client: PoolClient, sql: string): Promise<number> {
  const result = await client.query(sql);
  return Number(result.rows[0]?.count ?? 0);
}

export async function inspectCollectionMigrationPreflight(
  client: PoolClient,
): Promise<CollectionMigrationPreflightSnapshot> {
  const history = await client.query(
    `SELECT migration_name FROM "_prisma_migrations"
      WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL`,
  );
  const applied = new Set(history.rows.map((row) => row.migration_name));
  const required = [
    "20260523005224_init",
    "20260907120000_unique_laboratory_access_code",
    "20260914000100_area_registration_and_membership_roles",
  ];
  const hasLaboratoryColumn = await client.query(
    `SELECT EXISTS(
       SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='CollectionData'
          AND column_name='laboratoryRoomId'
     ) AS present`,
  );
  const divergentLaboratoryCount = hasLaboratoryColumn.rows[0]?.present
    ? await scalarCount(
        client,
        `SELECT count(*)::int AS count FROM "CollectionData" c
          JOIN "CollectionArea" a ON a.id=c."collectionAreaId"
         WHERE c."laboratoryRoomId" IS DISTINCT FROM a."laboratoryRoomId"`,
      )
    : 0;
  return {
    migrationHistoryAligned: required.every((name) => applied.has(name)),
    collectionCount: await scalarCount(
      client,
      `SELECT count(*)::int AS count FROM "CollectionData"`,
    ),
    orphanedAreaCount: await scalarCount(
      client,
      `SELECT count(*)::int AS count FROM "CollectionData" c
        LEFT JOIN "CollectionArea" a ON a.id=c."collectionAreaId"
       WHERE a.id IS NULL`,
    ),
    orphanedUserCount: await scalarCount(
      client,
      `SELECT count(*)::int AS count FROM "CollectionData" c
        LEFT JOIN "User" u ON u.id=c."userId" WHERE u.id IS NULL`,
    ),
    nonDerivableLaboratoryCount: await scalarCount(
      client,
      `SELECT count(*)::int AS count FROM "CollectionData" c
        LEFT JOIN "CollectionArea" a ON a.id=c."collectionAreaId"
       WHERE a."laboratoryRoomId" IS NULL`,
    ),
    divergentLaboratoryCount,
    scientificChildCounts: {
      water: await scalarCount(client, `SELECT count(*)::int AS count FROM "WaterData"`),
      soil: await scalarCount(client, `SELECT count(*)::int AS count FROM "SoilData"`),
      vegetation: await scalarCount(client, `SELECT count(*)::int AS count FROM "VegetationData"`),
      terrain: await scalarCount(client, `SELECT count(*)::int AS count FROM "TerrainData"`),
      diagnoses: await scalarCount(client, `SELECT count(*)::int AS count FROM "IHFRDiagnosis"`),
    },
  };
}

const invokedAsScript = process.argv[1]
  ?.replaceAll("\\", "/")
  .endsWith("/scripts/imp-004-migration-preflight.ts");

if (invokedAsScript) {
  const run = async () => {
    const safe = validateAuthFixtureEnvironment(process.env);
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({
      connectionString: safe.testDatabaseUrl,
      connectionTimeoutMillis: 15_000,
      max: 1,
    });
    try {
      const client = await pool.connect();
      try {
        const result = evaluateCollectionMigrationPreflight(
          await inspectCollectionMigrationPreflight(client),
        );
        process.stdout.write(`${JSON.stringify(result)}\n`);
      } finally {
        client.release();
      }
    } finally {
      await pool.end();
    }
  };
  run().catch((error: unknown) => {
    const code =
      error instanceof CollectionMigrationPreflightError
        ? error.code
        : "IMP004_PREFLIGHT_FAILED";
    process.stderr.write(`${code}\n`);
    process.exitCode = 1;
  });
}
