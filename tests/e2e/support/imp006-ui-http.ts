import type { APIRequestContext, Page, Response } from "@playwright/test";

type ResponseWaiter = Pick<Page, "waitForResponse">;
type ReadOnlyRequest = Pick<APIRequestContext, "get">;

export class MissingContextualPostResponseError extends Error {
  constructor(readonly pathname: string) {
    super(`No browser response was observed for contextual POST ${pathname}`);
    this.name = "MissingContextualPostResponseError";
  }
}

export class UnexpectedContextualPostStatusError extends Error {
  constructor(readonly pathname: string, readonly status: number) {
    super(`Contextual POST ${pathname} returned HTTP ${status}`);
    this.name = "UnexpectedContextualPostStatusError";
  }
}

function contextualEndpoint(endpoint: string): URL {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error("Contextual POST endpoint must be an absolute URL");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.pathname.startsWith("/api/laboratories/") ||
    url.pathname.endsWith("/") ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error("Contextual POST endpoint must be an exact laboratory API URL without credentials or query");
  }
  return url;
}

/** Matches one method, origin and complete contextual path; no suffix matching. */
export function matchesExactContextualPost(response: Response, endpoint: string): boolean {
  const expected = contextualEndpoint(endpoint);
  try {
    return response.request().method() === "POST" && new URL(response.url()).href === expected.href;
  } catch {
    return false;
  }
}

/** Registers the waiter before the UI action that sends the POST. */
export async function submitAndWaitForContextualPost(options: {
  page: ResponseWaiter;
  endpoint: string;
  expectedStatus: number;
  timeoutMs: number;
  submit: () => Promise<void>;
}): Promise<Response> {
  const { page, endpoint, expectedStatus, timeoutMs, submit } = options;
  const expected = contextualEndpoint(endpoint);
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("Contextual POST timeout must be a finite positive integer");
  }
  if (!Number.isInteger(expectedStatus) || expectedStatus < 100 || expectedStatus > 599) {
    throw new Error("Contextual POST expected status is invalid");
  }

  // Handle the waiter immediately so an early timeout cannot become an unhandled rejection
  // while Playwright is still completing the submit click.
  const observed = page.waitForResponse(
    (response) => matchesExactContextualPost(response, expected.href),
    { timeout: timeoutMs },
  ).then(
    (response) => ({ kind: "response" as const, response }),
    (error: unknown) => ({ kind: "error" as const, error }),
  );
  await submit();
  const result = await observed;
  if (result.kind === "error") {
    if (result.error instanceof Error && result.error.name === "TimeoutError") {
      throw new MissingContextualPostResponseError(expected.pathname);
    }
    throw result.error;
  }
  if (result.response.status() !== expectedStatus) {
    throw new UnexpectedContextualPostStatusError(expected.pathname, result.response.status());
  }
  return result.response;
}

export type ReadOnlyRecoverySnapshot = {
  operation: { status: number; body: unknown };
  current: { status: number; body: unknown };
};

/** Consults the recorded operation and CURRENT; it never resubmits the POST. */
export async function recoverIhfrAfterMissingResponse(
  cause: unknown,
  request: ReadOnlyRequest,
  diagnosisBase: string,
  idempotencyKey: string,
): Promise<ReadOnlyRecoverySnapshot> {
  if (!(cause instanceof MissingContextualPostResponseError)) throw cause;
  if (
    !/^\/api\/laboratories\/[0-9a-f-]{36}\/areas\/[0-9a-f-]{36}\/collections\/[0-9a-f-]{36}\/ihfr-diagnosis$/i.test(diagnosisBase) ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)
  ) {
    throw new Error("IHFR recovery requires an exact contextual path and idempotency key");
  }
  const operation = await request.get(`${diagnosisBase}/operations/${idempotencyKey}`, { timeout: 10_000 });
  const current = await request.get(`${diagnosisBase}/current`, { timeout: 10_000 });
  return {
    operation: { status: operation.status(), body: await operation.json() as unknown },
    current: { status: current.status(), body: await current.json() as unknown },
  };
}
