/** Deterministic Gate A adapter. No SMTP, debug route, or direct proof query. */
import { PrismaClient } from "../../src/generated/prisma/index.js";
import { testPostgresqlAdapter } from "./test-postgresql-adapter";
import { processMailBatch } from "../../src/app/api/server/mail/worker";
import { readMailProtection } from "../../src/app/api/server/mail/crypto";

const url = new URL(process.env.TEST_DATABASE_URL ?? "");
if (process.env.NODE_ENV !== "test" || process.env.ACCOUNTS_LOCAL_POSTGRESQL !== "1" ||
    process.env.TEST_DATABASE_CONFIRMATION !== "HIDROFLORESTAS_AUTH_TEST" ||
    url.hostname !== "127.0.0.1" || url.port !== "55427" || url.pathname !== "/accounts_regression_test" || !process.send) {
  throw new Error("Owned account mail harness guard failed");
}

const db = new PrismaClient({ adapter: testPostgresqlAdapter(url.toString()) });
const protection = readMailProtection(process.env, process.env.APP_PUBLIC_URL ?? "");
let processing = false;
const sentIds = new Set<string>();

process.on("message", async value => {
  if (typeof value === "object" && value !== null && "action" in value && value.action === "cleanup" && "emails" in value && Array.isArray(value.emails) && !processing) {
    const emails = value.emails.filter((email): email is string => typeof email === "string" && /^account-e2e-[a-z0-9-]+@accounts-test\.hidroflorestas\.invalid$/.test(email));
    if (emails.length !== value.emails.length) { process.send?.({ type: "failure" }); return; }
    processing = true;
    try {
      await db.$transaction(async tx => {
        const users = await tx.user.findMany({ where: { email: { in: emails } }, select: { id: true } });
        const ids = users.map(user => user.id);
        const challenges = await tx.accountEmailChallenge.findMany({ where: { userId: { in: ids } }, select: { id: true } });
        await tx.mailOutbox.deleteMany({ where: { OR: [{ id: { in: [...sentIds] } }, { challengeId: { in: challenges.map(challenge => challenge.id) } }] } });
        await tx.accountRequest.deleteMany({ where: { userId: { in: ids } } });
        await tx.accountEmailChallenge.deleteMany({ where: { userId: { in: ids } } });
        await tx.user.deleteMany({ where: { id: { in: ids }, email: { in: emails } } });
      });
      process.send?.({ type: "cleaned" });
    } catch { process.send?.({ type: "failure" }); } finally { processing = false; }
    return;
  }
  if (value !== "process" || processing) return;
  processing = true;
  const received: Array<{ recipient: string; subject: string; text: string }> = [];
  try {
    const metrics = await processMailBatch({ db, protection, transport: {
      async send(input) {
        if (!/^account-e2e-[a-z0-9-]+@accounts-test\.hidroflorestas\.invalid$/.test(input.recipient)) throw new Error("Synthetic recipient guard failed");
        sentIds.add(input.outboxId);
        received.push({ recipient: input.recipient, subject: input.message.subject, text: input.message.text });
      },
    } });
    process.send?.({ type: "batch", received, metrics });
  } catch { process.send?.({ type: "failure", message: "Account mail test adapter failed without exposing message contents." }); }
  finally { processing = false; }
});

process.on("disconnect", () => { void db.$disconnect().finally(() => process.exit(0)); });
// A previous or concurrent queue is not silently processed or removed by this fixture.
void db.mailOutbox.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }).then(count => {
  if (count !== 0) throw new Error("Owned account fixture requires an empty active queue");
  process.send?.({ type: "ready" });
}).catch(() => { process.send?.({ type: "failure" }); void db.$disconnect().finally(() => process.exit(1)); });
