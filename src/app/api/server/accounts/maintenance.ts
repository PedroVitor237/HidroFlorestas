import "server-only";
import { Prisma, type PrismaClient } from "@/generated/prisma";

export async function maintainAccountRequests(db: Pick<PrismaClient, "$executeRaw">, now = new Date()): Promise<number> {
  return db.$executeRaw(Prisma.sql`
    WITH selected AS (SELECT "action","keyMac" FROM "AccountRequest" WHERE "expiresAt"<=${now}
      ORDER BY "expiresAt","action","keyMac" FOR UPDATE SKIP LOCKED LIMIT 100)
    DELETE FROM "AccountRequest" r USING selected s WHERE r."action"=s."action" AND r."keyMac"=s."keyMac"`);
}
