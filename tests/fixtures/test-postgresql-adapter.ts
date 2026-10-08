import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws";
import { localPostgresqlContext } from "../../src/app/api/server/lib/local-postgresql-context";

/** Chooses direct TCP only for the owned local regression database. */
export function testPostgresqlAdapter(connectionString: string) {
  if (process.env.IMP006_LOCAL_POSTGRESQL === "1") {
    const url = new URL(connectionString);
    const context = localPostgresqlContext();
    if (process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST" || url.hostname !== "127.0.0.1" || url.port !== context.port || url.pathname !== `/${context.testDatabase}`) {
      throw new Error("Owned local regression database guard failed");
    }
    if (url.searchParams.has("options")) {
      throw new Error("Owned local regression database startup options must be selected by the fixture");
    }
    url.searchParams.set("options", "-cTimeZone=UTC");
    return new PrismaPg({ connectionString: url.toString() }, { schema: "public" });
  }
  neonConfig.webSocketConstructor = ws;
  return new PrismaNeon({ connectionString });
}
