import "dotenv/config";
import { readMailConfig } from "../src/app/api/server/mail/config";
import { createSmtpTransport } from "../src/app/api/server/mail/transport";

async function main() {
  try { await createSmtpTransport(readMailConfig()).verify(); process.stdout.write("SMTP connection/authentication verified; no message sent.\n"); }
  catch { process.stderr.write("SMTP diagnostic failed; check configuration/TLS/authentication.\n"); process.exitCode = 1; }
}
void main();
