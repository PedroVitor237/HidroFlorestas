import { timingSafeEqual } from "node:crypto";

export async function handleMailTrigger(request: Request, run: () => Promise<unknown>, secret = process.env.MAIL_WORKER_SECRET): Promise<Response> {
  const reply = (value: object, status: number) => Response.json(value, { status, headers: { "Cache-Control": "no-store" } });
  if (!secret || !/^[A-Za-z0-9_-]{32,128}$/.test(secret)) return reply({ error: { code: "CONFIGURATION" } }, 503);
  const authorization = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (Buffer.byteLength(authorization) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(authorization), Buffer.from(expected))) return reply({ error: { code: "UNAUTHENTICATED" } }, 401);
  if (new URL(request.url).search || request.body !== null) return reply({ error: { code: "INVALID_INPUT" } }, 400);
  try {
    const raw = await run();
    const source = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
    const result: Record<string, number> = {};
    for (const name of ["claimed", "accepted", "retried", "dead", "stale", "expired", "cancelled", "recoveredLeases", "queueAgeMs", "pending", "purged"]) {
      const value = source[name]; result[name] = typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
    }
    return reply({ result }, 200);
  }
  catch { return reply({ error: { code: "WORKER_UNAVAILABLE" } }, 503); }
}
