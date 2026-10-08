import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readMailConfig } from "../src/app/api/server/mail/config";
import { readMailProtection } from "../src/app/api/server/mail/crypto";
import { validateMailbox } from "../src/app/api/server/mail/contracts";
import { enqueueMail } from "../src/app/api/server/mail/outbox";
import { processMailBatch } from "../src/app/api/server/mail/worker";
import { createSmtpTransport } from "../src/app/api/server/mail/transport";

async function main() {
  let setupReady = false;
  try {
    // Explicit local operator acknowledgement + matching allowlist; never infer a real recipient.
    if (process.env.MAIL_SMOKE_CONFIRMATION !== "HIDROFLORESTAS_GMAIL_TEST" || !process.env.MAIL_SMOKE_RECIPIENT || process.env.MAIL_SMOKE_RECIPIENT !== process.env.MAIL_SMOKE_ALLOWED_RECIPIENT) throw new Error("setup");
    validateMailbox(process.env.MAIL_SMOKE_RECIPIENT);
    const recipient = process.env.MAIL_SMOKE_RECIPIENT;
    const config = readMailConfig(), protection = readMailProtection(process.env, config.publicUrl);
    const { readOnlyImp006Preflight } = await import("./imp006-test-preflight");
    await readOnlyImp006Preflight();
    setupReady = true;
    const { withImp006PostgresqlSchema, selectedImp006DatabaseVariable } = await import("../tests/fixtures/postgresql-schema-lifecycle");
    const { setupIHFRDiagnosisFixtures } = await import("../tests/fixtures/ihfr-diagnosis-fixtures");
    await withImp006PostgresqlSchema(selectedImp006DatabaseVariable(), async (client, db) => {
      await setupIHFRDiagnosisFixtures(client);
      const now = new Date();
      await db.$transaction((tx) => enqueueMail(tx, { idempotencyKey: randomUUID().replaceAll("-", ""), recipient,
        content: { template: "email-verification-v1", name: "Teste sintético autorizado", code: "000042" }, expiresAt: new Date(now.getTime() + 600_000) }, protection, now));
      const result = await processMailBatch({ db, protection, transport: createSmtpTransport(config) });
      assert.equal(result.accepted, 1);
      process.stdout.write(JSON.stringify({ smoke: "GMAIL", smtpAccepted: 1, inboxReceipt: "NOT_OBSERVED", synthetic: true }) + "\n");
    });
  } catch {
    process.stderr.write(`Gmail smoke ${setupReady ? "FAIL" : "BLOQUEIO_DE_SETUP"}: check explicit test-recipient authorization, SMTP/protection configuration and isolated PostgreSQL. No provider or recipient details logged.\n`);
    process.exitCode = 1;
  }
}
void main();
