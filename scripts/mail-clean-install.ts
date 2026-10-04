import { execFileSync, spawn } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

async function main() {
  const directory = await mkdtemp(join(tmpdir(), "hidro-mail-clean-"));
  const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
  const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "-z"], { encoding: "utf8" }).split("\0").filter((file) =>
    /^(src\/app\/api\/(server\/mail\/|internal\/mail\/)|tests\/(mail\/|integration\/mail-|migration\/mail-)|scripts\/mail-|specs\/mail-foundation\/|docs\/operations\/mail-|prisma\/migrations\/20261004000100_mail_foundation\/|\.specify\/feature\.json$|\.env\.mail\.example$)/.test(file));
  const paths = [...new Set([...tracked, ...untracked])].sort();
  const digest = createHash("sha256");
  for (const file of paths) {
    const target = join(directory, file);
    await mkdir(dirname(target), { recursive: true });
    await cp(file, target);
    if (file === "package.json" || file === "package-lock.json") digest.update(file).update(await readFile(file));
  }
  process.stdout.write(`Clean isolated snapshot prepared; dependency fingerprint=${digest.digest("hex")}\n`);
  const npmCli = join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  for (const args of [[npmCli, "ci"], [npmCli, "exec", "--", "prisma", "generate"], [npmCli, "run", "test:mail:unit"], [npmCli, "run", "typecheck"]]) {
    process.stdout.write(`CLEAN_STEP=${args.slice(1).join(" ")}\n`);
    const child = spawn(process.execPath, args, { cwd: directory, windowsHide: true, stdio: "inherit" });
    const code = await new Promise<number>((resolve, reject) => { child.once("error", reject); child.once("close", (exit) => resolve(exit ?? 1)); });
    if (code) { process.exitCode = code; return; }
  }
  process.stdout.write("Clean npm ci, Prisma generation, mail TLS tests and typecheck PASS. Snapshot retained in OS temporary directory; no workspace dependencies removed.\n");
}
void main().catch(() => { process.stderr.write("Clean validation failed without exposing configuration.\n"); process.exitCode = 1; });
