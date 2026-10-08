import "dotenv/config";
import { runConfiguredMailWorker } from "../src/app/api/server/mail/runtime";

async function main() {
  let configured = false;
  try {
    const { readMailConfig } = await import("../src/app/api/server/mail/config");
    const { readMailProtection } = await import("../src/app/api/server/mail/crypto");
    readMailProtection(process.env, readMailConfig().publicUrl);
    configured = true;
    await runConfiguredMailWorker();
  } catch { process.stderr.write("Mail worker failed: check configuration/database; no provider details logged.\n"); process.exitCode = 1; }
  finally {
    if (configured) try { const { prisma } = await import("../src/app/api/server/lib/prisma"); await prisma.$disconnect(); }
    catch { process.stderr.write("Mail worker resource cleanup failed; details redacted.\n"); process.exitCode = 1; }
  }
}
void main();
