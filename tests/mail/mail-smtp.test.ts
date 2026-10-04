import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { SMTPServer, type SMTPServerOptions } from "smtp-server";
import { createSmtpTransport, smtpDeadlineAt } from "../../src/app/api/server/mail/transport";
import { MAIL_POLICY } from "../../src/app/api/server/mail/contracts";

let directory: string, cert: string, privateKey: string;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), "hidro-mail-tls-"));
  const gitExec = execFileSync("git", ["--exec-path"], { encoding: "utf8" }).trim();
  const executable = process.platform === "win32" ? resolve(dirname(gitExec), "..", "bin", "openssl.exe") : "openssl";
  execFileSync(executable, ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", join(directory, "key.pem"), "-out", join(directory, "cert.pem"), "-days", "1", "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost"], { stdio: "ignore" });
  cert = await readFile(join(directory, "cert.pem"), "utf8"); privateKey = await readFile(join(directory, "key.pem"), "utf8");
});
after(async () => { if (directory) await rm(directory, { recursive: true, force: true }); });

async function withSmtp(options: SMTPServerOptions, run: (port: number, accepted: string[], server: SMTPServer) => Promise<void>) {
  const accepted: string[] = [];
  const server = new SMTPServer({ logger: false, key: privateKey, cert, onAuth(_auth, _session, callback) { callback(null, { user: "synthetic" }); },
    onData(stream, _session, callback) { let data = ""; stream.on("data", (chunk) => { data += chunk.toString(); }); stream.on("end", () => { accepted.push(data); callback(); }); }, ...options });
  server.on("error", () => {}); // Expected rejected TLS handshakes; no provider detail in output.
  await new Promise<void>((resolveReady) => server.listen(0, "127.0.0.1", resolveReady));
  const address = server.server.address();
  if (!address || typeof address === "string") throw new Error("SMTP fixture address missing");
  try { await run(address.port, accepted, server); }
  finally { await new Promise<void>((resolveClosed) => server.close(resolveClosed)); }
}

const settings = (port: number, secure: boolean, trust = true) => ({ host: "127.0.0.1", port, secure, requireTLS: true, user: "synthetic@example.invalid", password: "synthetic-password", from: "synthetic@example.invalid", servername: "localhost", ...(trust ? { ca: cert } : {}) });
const input = () => ({ outboxId: randomUUID(), recipient: "recipient@example.invalid", message: { subject: "Teste sintético", text: "000042", html: "<p>000042</p>" }, expiresAt: new Date(Date.now() + 60_000), deadlineAt: new Date(Date.now() + MAIL_POLICY.smtpDeadlineMs) });

for (const secure of [true, false]) test(`Nodemailer real ${secure ? "implicit TLS" : "required STARTTLS"}: accepted MIME and verify distinct`, async () => {
  await withSmtp({ secure }, async (port, accepted) => {
    const transport = createSmtpTransport(settings(port, secure));
    await transport.verify(); assert.equal(accepted.length, 0);
    await transport.send(input()); assert.equal(accepted.length, 1);
    assert.match(accepted[0], /multipart\/alternative/); assert.match(accepted[0], /000042/);
  });
});

test("Nodemailer refuses untrusted certificate, no STARTTLS and bad authentication", async () => {
  await withSmtp({ secure: true }, async (port, accepted) => {
    await assert.rejects(createSmtpTransport(settings(port, true, false)).send(input()), /TLS/); assert.equal(accepted.length, 0);
  });
  await withSmtp({ secure: false, disabledCommands: ["STARTTLS"] }, async (port, accepted) => {
    await assert.rejects(createSmtpTransport(settings(port, false)).send(input()), /TLS/); assert.equal(accepted.length, 0);
  });
  await withSmtp({ secure: false, onAuth(_a, _s, callback) { callback(new Error("synthetic authentication denied")); } }, async (port, accepted) => {
    await assert.rejects(createSmtpTransport(settings(port, false)).send(input()), /AUTHENTICATION/); assert.equal(accepted.length, 0);
  });
});

test("R1 operational deadline after SMTP accepts DATA destroys connection and remains ambiguous", async () => {
  let dataSeen!: () => void;
  const seen = new Promise<void>((resolveSeen) => { dataSeen = resolveSeen; });
  let connectionClosed!: () => void;
  const closed = new Promise<void>((resolveClosed) => { connectionClosed = resolveClosed; });
  await withSmtp({ secure: true, onData(stream) { stream.resume(); stream.on("end", dataSeen); /* Deliberately lose the acceptance reply. */ }, onClose() { connectionClosed(); } }, async (port) => {
    const sending = createSmtpTransport(settings(port, true)).send({ ...input(), deadlineAt: new Date(Date.now() + 1_500) });
    const assertion = assert.rejects(sending, /TIMEOUT/);
    await Promise.race([seen, assertion.then(() => { throw new Error("Deadline expired before synthetic DATA acceptance"); })]);
    await assertion; await closed;
  });
});

test("R1 transport deadline is the minimum of SMTP cap, proof validity and operational lease deadline", () => {
  const start = Date.parse("2030-01-01T12:00:00Z");
  const proof = new Date(start + 60_000), leaseDeadline = new Date(start + 8_000);
  assert.equal(smtpDeadlineAt(proof, leaseDeadline, start), start + 8_000);
  assert.equal(smtpDeadlineAt(new Date(start + 3_000), leaseDeadline, start), start + 3_000);
  assert.equal(smtpDeadlineAt(proof, new Date(start + 30_000), start), start + MAIL_POLICY.smtpDeadlineMs);
  assert.equal(smtpDeadlineAt(proof, leaseDeadline, start, 1_000), start + 1_000);
  assert.throws(() => smtpDeadlineAt(proof, new Date(start), start), /TIMEOUT/);
  assert.throws(() => smtpDeadlineAt(new Date(start), leaseDeadline, start), /PERMANENT/);
  assert.throws(() => smtpDeadlineAt(proof, new Date(NaN), start), /INVALID_INPUT/);
  assert.throws(() => smtpDeadlineAt(proof, undefined as unknown as Date, start), /INVALID_INPUT/);
});

test("R1 expired operational deadline or proof never opens SMTP connection", async () => {
  let connections = 0;
  await withSmtp({ secure: true, onConnect(_session, callback) { connections++; callback(); } }, async (port, accepted) => {
    const transport = createSmtpTransport(settings(port, true));
    await assert.rejects(transport.send({ ...input(), deadlineAt: new Date(Date.now() - 1) }), /TIMEOUT/);
    await assert.rejects(transport.send({ ...input(), expiresAt: new Date(Date.now() - 1) }), /PERMANENT/);
    assert.equal(connections, 0); assert.equal(accepted.length, 0);
  });
});
