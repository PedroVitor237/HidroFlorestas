import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createServer } from "node:net";
import { access, mkdir, open, rm, statfs } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { chromium } from "@playwright/test";

const minimumFreeGiB = 4;
const minimumFreeInodes = 1_000;

export function resourceThreshold(value: string | undefined) {
  if (value === undefined) return minimumFreeGiB;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 100) throw new Error("IMP006_MIN_FREE_GIB must be between 1 and 100");
  return parsed;
}

export function assertResourceSnapshot(path: string, bytesFree: number, inodesFree: number, requiredGiB: number) {
  if (bytesFree < requiredGiB * 1024 ** 3) throw new Error(`UI_RESOURCE_DISK_LOW: ${path}`);
  if (inodesFree > 0 && inodesFree < minimumFreeInodes) throw new Error(`UI_RESOURCE_INODES_LOW: ${path}`);
}

function evidenceRoot() {
  const base = process.env.LOCALAPPDATA ?? join(homedir(), ".local", "state");
  return join(base, "HidroFlorestas", "imp006-ui-evidence");
}

export async function requireBrowserExecutable(path: string) {
  try { await access(path); }
  catch { throw new Error("UI_RESOURCE_BROWSER_MISSING: install the locked Playwright Chromium"); }
}

async function writable(directory: string) {
  const path = join(directory, `.imp006-write-probe-${randomUUID()}`);
  const file = await open(path, "wx", 0o600);
  try { await file.writeFile("ok"); }
  finally { await file.close(); await rm(path, { force: true }); }
}

async function processSmoke() {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, ["-e", "process.exit(0)"], { stdio: "ignore", windowsHide: true });
    const timer = setTimeout(() => { child.kill(); reject(new Error("UI_RESOURCE_PROCESS_TIMEOUT")); }, 10_000);
    child.once("error", (error) => { clearTimeout(timer); reject(new Error("UI_RESOURCE_PROCESS_UNAVAILABLE", { cause: error })); });
    child.once("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error("UI_RESOURCE_PROCESS_UNAVAILABLE"));
    });
  });
}

async function loopbackSmoke() {
  await new Promise<void>((resolve, reject) => {
    const server = createServer();
    server.once("error", (error) => reject(new Error("UI_RESOURCE_LOOPBACK_UNAVAILABLE", { cause: error })));
    server.listen(0, "127.0.0.1", () => server.close((error) => error ? reject(error) : resolve()));
  });
}

/** Creates only this run's persistent local evidence directory; it is never auto-deleted. */
export async function checkUiResources(runId: string, env: NodeJS.ProcessEnv = process.env) {
  if (!/^HF007-UI-[A-Za-z0-9-]{6,50}$/.test(runId)) throw new Error("UI_RUN_ID_INVALID");
  const browserExecutable = chromium.executablePath();
  await requireBrowserExecutable(browserExecutable);
  const root = evidenceRoot();
  await mkdir(root, { recursive: true, mode: 0o700 });
  const paths = [process.cwd(), tmpdir(), root, dirname(browserExecutable)];
  const requiredGiB = resourceThreshold(env.IMP006_MIN_FREE_GIB);
  for (const path of paths) {
    const fs = await statfs(path);
    assertResourceSnapshot(path, Number(fs.bavail) * Number(fs.bsize), Number(fs.ffree), requiredGiB);
  }
  await writable(root);
  await writable(tmpdir());
  await processSmoke();
  await loopbackSmoke();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, timeout: 20_000 });
    const page = await browser.newPage();
    await page.goto("about:blank");
  } catch (error) {
    throw new Error("UI_RESOURCE_BROWSER_LAUNCH_FAILED", { cause: error });
  } finally { await browser?.close(); }
  const directory = join(root, runId);
  try { await mkdir(directory, { mode: 0o700 }); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error("UI_EVIDENCE_RUN_ALREADY_USED");
    throw error;
  }
  return { evidenceDirectory: directory, browserReady: true, minimumFreeGiB: requiredGiB };
}
