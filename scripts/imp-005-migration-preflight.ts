import { Pool, neonConfig, type PoolClient } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { validateAuthFixtureEnvironment } from "../tests/fixtures/auth-users";
export type EnvironmentalPreflight = { prerequisite: boolean; immutableParent: boolean; orphanCount: number; collectionCount: number; legacyCount: number };
export function evaluateEnvironmentalPreflight(s: EnvironmentalPreflight): {ok:true; counts: {collections:number;legacy:number}} {
 if (!s.prerequisite || !s.immutableParent || s.orphanCount !== 0 || [s.orphanCount,s.collectionCount,s.legacyCount].some(n=>!Number.isSafeInteger(n)||n<0)) throw new Error("IMP005_UNSAFE_BASELINE");
 return {ok:true,counts:{collections:s.collectionCount,legacy:s.legacyCount}};
}
export async function inspectEnvironmentalPreflight(client: PoolClient): Promise<EnvironmentalPreflight> {
 const history = await client.query(`SELECT EXISTS(SELECT 1 FROM "_prisma_migrations" WHERE migration_name='20260915000100_collection_registration_metadata' AND finished_at IS NOT NULL AND rolled_back_at IS NULL) AS present`);
 const trigger = await client.query(`SELECT EXISTS(SELECT 1 FROM pg_trigger WHERE tgrelid='"CollectionData"'::regclass AND tgname='imp004_collection_immutable' AND tgenabled='O') AS present`);
 const rows = await client.query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE a.id IS NULL OR u.id IS NULL OR c."laboratoryRoomId" IS DISTINCT FROM a."laboratoryRoomId")::int AS orphans FROM "CollectionData" c LEFT JOIN "CollectionArea" a ON a.id=c."collectionAreaId" LEFT JOIN "User" u ON u.id=c."userId"`);
 const legacy = await client.query(`SELECT ((SELECT count(*) FROM "WaterData")+(SELECT count(*) FROM "SoilData")+(SELECT count(*) FROM "VegetationData")+(SELECT count(*) FROM "TerrainData"))::int AS total`);
 return {prerequisite:history.rows[0].present, immutableParent:trigger.rows[0].present, orphanCount:rows.rows[0].orphans, collectionCount:rows.rows[0].total, legacyCount:legacy.rows[0].total};
}
if(process.argv[1]?.endsWith('/imp-005-migration-preflight.ts')) {
 dotenv.config({path:'.env',quiet:true}); dotenv.config({path:'.env.test.local',quiet:true});
 const run=async()=>{
  const safe=validateAuthFixtureEnvironment(process.env); neonConfig.webSocketConstructor=ws;
  const pool=new Pool({connectionString:safe.testDatabaseUrl,max:1,connectionTimeoutMillis:15000});
  try { const client=await pool.connect(); try { console.log(JSON.stringify(evaluateEnvironmentalPreflight(await inspectEnvironmentalPreflight(client)))); } finally {client.release();} } finally {await pool.end();}
 };
 run().catch(()=>{console.error('IMP005_PREFLIGHT_FAILED');process.exitCode=1;});
}
