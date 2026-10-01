import bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { Pool, type PoolClient } from "pg";

import { imp006Target, readOnlyImp006Preflight } from "./imp006-test-preflight";

export type UiAccountProfile = "legacy" | "reserve-01" | "reserve-02";
type AccountIdentity = { id: string; email: string };
type AccountSnapshot = AccountIdentity & { status: string; role: string };
type StoredAccount = AccountSnapshot & { password: string };
type LocalSecret = {
  marker: "hidroflorestas:imp006-ui-reserve:v1";
  fingerprint: string;
  id: string;
  email: string;
  password: string;
};

// This fingerprint is the E2E direct target verified in this execution. It is not a branch_id proof.
export const approvedUiTargetFingerprint = "6903ad2ff1ef";
const identities: Record<UiAccountProfile, AccountIdentity> = {
  legacy: { id: "00000000-0000-4000-8000-000000000001", email: "active@auth-test.hidroflorestas.invalid" },
  "reserve-01": { id: "0f55f1c1-562f-4369-9c1a-f8026b7fc856", email: "hf007-ui-reserve-01@auth-test.hidroflorestas.invalid" },
  "reserve-02": { id: "32a47e04-36fa-409b-a54e-f79a68818a0a", email: "hf007-ui-reserve-02@auth-test.hidroflorestas.invalid" },
};
const secretMarker = "hidroflorestas:imp006-ui-reserve:v1";

export function uiAccountProfile(value: string | undefined): UiAccountProfile {
  const profile = value ?? "legacy";
  if (profile !== "legacy" && profile !== "reserve-01" && profile !== "reserve-02") {
    throw new Error("UI_ACCOUNT_NOT_ALLOWLISTED: choose legacy, reserve-01 or reserve-02");
  }
  return profile;
}

/** The same five-link rule used by the laboratory service, including inactive laboratories. */
export function validateUiAccountSnapshot(
  account: AccountSnapshot | null,
  expected: AccountIdentity,
  credentialMatches: boolean,
  membershipCount: number,
  usedRunCount: number,
): number {
  if (!account) throw new Error("UI_ACCOUNT_NOT_FOUND");
  if (account.id !== expected.id || account.email !== expected.email) throw new Error("UI_ACCOUNT_NOT_ALLOWLISTED");
  if (account.status !== "ACTIVE") throw new Error("UI_ACCOUNT_NOT_ACTIVE");
  if (account.role !== "USER") throw new Error("UI_ACCOUNT_ROLE_MISMATCH");
  if (!credentialMatches) throw new Error("UI_ACCOUNT_CREDENTIAL_MISMATCH");
  if (!Number.isInteger(membershipCount) || membershipCount < 0) throw new Error("UI_ACCOUNT_LINK_COUNT_INVALID");
  if (membershipCount >= 5) throw new Error("E2E_ACCOUNT_CAPACITY_EXHAUSTED");
  if (usedRunCount !== 0) throw new Error("UI_RUN_ID_ALREADY_USED");
  return membershipCount;
}

function secretDirectory() {
  const base = process.env.LOCALAPPDATA ?? join(homedir(), ".local", "state");
  return join(base, "HidroFlorestas", "imp006-ui-reserve");
}

function secretPath(profile: Exclude<UiAccountProfile, "legacy">) {
  return join(secretDirectory(), `${profile}.json`);
}

async function readSecret(profile: Exclude<UiAccountProfile, "legacy">, fingerprint: string): Promise<LocalSecret | null> {
  let text: string;
  try { text = await readFile(secretPath(profile), "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  let value: Partial<LocalSecret>;
  try { value = JSON.parse(text) as Partial<LocalSecret>; }
  catch { throw new Error("UI_RESERVE_SECRET_INVALID"); }
  const expected = identities[profile];
  if (value.marker !== secretMarker || value.fingerprint !== fingerprint || value.id !== expected.id || value.email !== expected.email ||
      typeof value.password !== "string" || value.password.length < 32) {
    throw new Error("UI_RESERVE_SECRET_INVALID_OR_TARGET_CHANGED");
  }
  return value as LocalSecret;
}

async function createSecret(profile: Exclude<UiAccountProfile, "legacy">, fingerprint: string): Promise<LocalSecret> {
  const expected = identities[profile];
  const value: LocalSecret = {
    marker: secretMarker,
    fingerprint,
    ...expected,
    password: randomBytes(36).toString("base64url"),
  };
  await mkdir(secretDirectory(), { recursive: true, mode: 0o700 });
  await writeFile(secretPath(profile), JSON.stringify(value), { flag: "wx", mode: 0o600 });
  return value;
}

function advisoryKeys(id: string): [number, number] {
  const hash = createHash("sha256").update(`hidroflorestas:imp006-ui:${id}`).digest();
  return [hash.readInt32BE(0), hash.readInt32BE(4)];
}

async function lockAccount(client: PoolClient, id: string) {
  const [first, second] = advisoryKeys(id);
  const lock = await client.query<{ acquired: boolean }>("SELECT pg_try_advisory_lock($1::int, $2::int) AS acquired", [first, second]);
  if (!lock.rows[0]?.acquired) throw new Error("UI_ACCOUNT_LEASE_BUSY");
  return async () => {
    const result = await client.query<{ released: boolean }>("SELECT pg_advisory_unlock($1::int, $2::int) AS released", [first, second]);
    if (!result.rows[0]?.released) throw new Error("UI_ACCOUNT_LEASE_RELEASE_FAILED");
  };
}

export async function closeAccountSession(
  pool: Pool,
  client: PoolClient | undefined,
  unlock: (() => Promise<void>) | undefined,
  primaryError?: unknown,
  destroy = false,
) {
  const cleanupErrors: unknown[] = [];
  if (client && unlock) {
    try { await unlock(); } catch (error) { cleanupErrors.push(error); }
  }
  if (client) {
    try { client.release(destroy || cleanupErrors.length > 0); } catch (error) { cleanupErrors.push(error); }
  }
  try { await pool.end(); } catch (error) { cleanupErrors.push(error); }
  if (cleanupErrors.length) {
    throw new AggregateError(primaryError === undefined ? cleanupErrors : [primaryError, ...cleanupErrors],
      "UI account session cleanup failed");
  }
}

async function accountRows(client: PoolClient, identity: AccountIdentity): Promise<StoredAccount[]> {
  const result = await client.query<StoredAccount>(
    'SELECT id, email, password, status, role FROM public."User" WHERE id = $1 OR email = $2',
    [identity.id, identity.email],
  );
  return result.rows;
}

async function membershipCount(client: PoolClient, id: string) {
  const result = await client.query<{ count: number }>(
    'SELECT count(*)::int AS count FROM public."ResearchersLinked" WHERE "userId" = $1',
    [id],
  );
  return result.rows[0]?.count ?? -1;
}

async function checkedTarget(env: NodeJS.ProcessEnv) {
  const verified = await readOnlyImp006Preflight(env);
  if (verified.schema !== "public" || verified.fingerprint !== approvedUiTargetFingerprint || env.IMP006_LOCAL_POSTGRESQL) {
    throw new Error("UI_E2E_TARGET_NOT_APPROVED");
  }
  return verified;
}

/** Creates only the exact reserved user. Existing rows are verified and never updated. */
export async function prepareUiReserve(profile: Exclude<UiAccountProfile, "legacy">, env: NodeJS.ProcessEnv = process.env) {
  const verified = await checkedTarget(env);
  const pool = new Pool({ connectionString: imp006Target(env).connectionString, connectionTimeoutMillis: 15_000, query_timeout: 5_000, max: 1 });
  let client: PoolClient | undefined;
  let unlock: (() => Promise<void>) | undefined;
  let primaryError: unknown;
  try {
    client = await pool.connect();
    unlock = await lockAccount(client, identities[profile].id);
    const rows = await accountRows(client, identities[profile]);
    if (rows.length > 1 || (rows.length === 1 && (rows[0].id !== identities[profile].id || rows[0].email !== identities[profile].email))) {
      throw new Error("UI_RESERVE_IDENTITY_COLLISION");
    }
    let secret = await readSecret(profile, verified.fingerprint);
    if (rows.length && !secret) throw new Error("UI_RESERVE_EXISTING_ACCOUNT_NOT_OWNED");
    if (!secret) secret = await createSecret(profile, verified.fingerprint);
    if (rows.length === 0) {
      const passwordHash = await bcrypt.hash(secret.password, 12);
      await client.query(
        'INSERT INTO public."User" (id, email, "firstName", "lastName", password, role, status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())',
        [secret.id, secret.email, "IHFR", `E2E ${profile}`, passwordHash, "USER", "ACTIVE"],
      );
    }
    const account = (await accountRows(client, identities[profile]))[0] ?? null;
    const matches = account ? await bcrypt.compare(secret.password, account.password) : false;
    const count = await membershipCount(client, identities[profile].id);
    validateUiAccountSnapshot(account, identities[profile], matches, count, 0);
    return { profile, fingerprint: verified.fingerprint, accountId: identities[profile].id, capacity: `${count}/5`, created: rows.length === 0 };
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    await closeAccountSession(pool, client, unlock, primaryError);
  }
}

export interface UiAccountLease {
  profile: UiAccountProfile;
  accountId: string;
  email: string;
  password: string;
  capacityBefore: number;
  signal: AbortSignal;
  capacityNow: () => Promise<number>;
  release: () => Promise<void>;
}

/** Holds a session advisory lock during the browser without holding a SQL transaction. */
export async function acquireUiAccountLease(env: NodeJS.ProcessEnv, runId: string): Promise<UiAccountLease> {
  const verified = await checkedTarget(env);
  const profile = uiAccountProfile(env.IMP006_UI_ACCOUNT_PROFILE);
  const expected = identities[profile];
  const secret = profile === "legacy" ? null : await readSecret(profile, verified.fingerprint);
  if (profile !== "legacy" && !secret) throw new Error("UI_RESERVE_NOT_PREPARED");
  const email = profile === "legacy" ? env.IMP006_UI_EMAIL : secret?.email;
  const password = profile === "legacy" ? env.IMP006_UI_PASSWORD : secret?.password;
  if (email !== expected.email || !password) throw new Error("UI_ACCOUNT_CREDENTIALS_NOT_CONFIGURED");
  const pool = new Pool({ connectionString: imp006Target(env).connectionString, connectionTimeoutMillis: 15_000, query_timeout: 5_000, max: 1 });
  let client: PoolClient | undefined;
  let unlock: (() => Promise<void>) | undefined;
  try {
    client = await pool.connect();
    unlock = await lockAccount(client, expected.id);
    await client.query("BEGIN READ ONLY");
    let count: number;
    let readError: unknown;
    try {
      const rows = await accountRows(client, expected);
      if (rows.length > 1) throw new Error("UI_ACCOUNT_NOT_ALLOWLISTED");
      const account = rows[0] ?? null;
      const matches = account ? await bcrypt.compare(password, account.password) : false;
      const links = await membershipCount(client, expected.id);
      const used = await client.query<{ count: number }>(
        'SELECT count(*)::int AS count FROM public."LaboratoryRoom" WHERE name = $1',
        [`${runId} Laboratório`],
      );
      count = validateUiAccountSnapshot(account, expected, matches, links, used.rows[0]?.count ?? -1);
    } catch (error) {
      readError = error;
      throw error;
    } finally {
      try { await client.query("ROLLBACK"); }
      catch (error) {
        if (readError !== undefined) throw new AggregateError([readError, error], "UI account read-only preflight rollback failed");
        throw error;
      }
    }
    const activeClient = client;
    const activeUnlock = unlock;
    const aborter = new AbortController();
    const markLost = () => aborter.abort(new Error("UI_ACCOUNT_LEASE_LOST"));
    activeClient.on("error", markLost);
    let pinging = false;
    const heartbeat = setInterval(() => {
      if (pinging || aborter.signal.aborted) return;
      pinging = true;
      void activeClient.query("SELECT 1").catch(markLost).finally(() => { pinging = false; });
    }, 3_000);
    heartbeat.unref();
    let released = false;
    return {
      profile, accountId: expected.id, email, password, capacityBefore: count,
      signal: aborter.signal,
      capacityNow: () => membershipCount(activeClient, expected.id),
      release: async () => {
        if (released) return;
        released = true;
        clearInterval(heartbeat);
        try {
          await closeAccountSession(pool, activeClient, aborter.signal.aborted ? undefined : activeUnlock,
            undefined, aborter.signal.aborted);
        } finally { activeClient.off("error", markLost); }
      },
    };
  } catch (error) {
    await closeAccountSession(pool, client, unlock, error);
    throw error;
  }
}
