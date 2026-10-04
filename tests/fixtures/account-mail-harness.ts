import { fork, type ChildProcess } from "node:child_process";
import path from "node:path";

export type SyntheticAccountMail = { recipient: string; subject: string; text: string };
type Batch = { type: "batch"; received: SyntheticAccountMail[]; metrics: { claimed: number; accepted: number; pending: number; dead: number; stale: number; retried: number; cancelled: number } };

export class AccountMailHarness {
  private readonly child: ChildProcess;
  private constructor() {
    this.child = fork(path.resolve("tests/fixtures/account-mail-worker.ts"), [], {
      execArgv: ["--conditions=react-server", "--import=tsx"],
      env: { ...process.env, NODE_ENV: "test" }, silent: true,
    });
    // Message contents travel only over IPC and never enter test logs/artifacts.
    this.child.stdout?.resume(); this.child.stderr?.resume();
  }

  static async start() {
    const harness = new AccountMailHarness();
    await harness.waitFor<{ type: "ready" }>("ready");
    return harness;
  }

  private waitFor<T>(type: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { cleanup(); reject(new Error("Account mail harness timed out; no contents logged.")); }, 20_000);
      const onMessage = (value: unknown) => {
        if (typeof value !== "object" || value === null || !("type" in value)) return;
        if (value.type === type) { cleanup(); resolve(value as T); }
        else if (value.type === "failure") { cleanup(); reject(new Error("Account mail harness failed; no contents logged.")); }
      };
      const onExit = () => { cleanup(); reject(new Error("Account mail harness exited; no contents logged.")); };
      const cleanup = () => { clearTimeout(timeout); this.child.off("message", onMessage); this.child.off("exit", onExit); };
      this.child.on("message", onMessage); this.child.once("exit", onExit);
    });
  }

  async process(): Promise<Batch> {
    const result = this.waitFor<Batch>("batch");
    this.child.send("process");
    return result;
  }

  async cleanup(emails: string[]) {
    const result = this.waitFor<{ type: "cleaned" }>("cleaned");
    this.child.send({ action: "cleanup", emails });
    await result;
  }

  async close() {
    if (this.child.exitCode !== null) return;
    const exited = new Promise<void>(resolve => this.child.once("exit", () => resolve()));
    this.child.disconnect();
    const timeout = setTimeout(() => this.child.kill(), 5_000);
    try { await exited; } finally { clearTimeout(timeout); }
  }
}
