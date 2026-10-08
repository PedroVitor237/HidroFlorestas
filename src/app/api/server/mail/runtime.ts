import "server-only";
import { readMailConfig } from "./config";
import { readMailProtection } from "./crypto";
import { createSmtpTransport } from "./transport";
import { processMailBatch } from "./worker";
import { maintainAccountRequests } from "../accounts/maintenance";

export async function runConfiguredMailWorker() {
  const config = readMailConfig();
  const protection = readMailProtection(process.env, config.publicUrl);
  const { prisma } = await import("../lib/prisma");
  await maintainAccountRequests(prisma);
  return processMailBatch({ db: prisma, protection, transport: createSmtpTransport(config), log: (entry) => { process.stdout.write(JSON.stringify(entry) + "\n"); } });
}
