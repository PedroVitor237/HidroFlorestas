import assert from "node:assert/strict";
import { test } from "node:test";
import type { APIRequestContext, Page, Response } from "@playwright/test";
import {
  matchesExactContextualPost,
  MissingContextualPostResponseError,
  recoverIhfrAfterMissingResponse,
  submitAndWaitForContextualPost,
  UnexpectedContextualPostStatusError,
} from "../e2e/support/imp006-ui-http";

const laboratoryId = "11111111-1111-4111-8111-111111111111";
const areaId = "22222222-2222-4222-8222-222222222222";
const collectionId = "33333333-3333-4333-8333-333333333333";
const key = "44444444-4444-4444-8444-444444444444";
const base = `/api/laboratories/${laboratoryId}/areas/${areaId}/collections/${collectionId}/ihfr-diagnosis`;
const endpoint = `http://127.0.0.1:3000${base}/diagnoses`;

function fakeResponse(url = endpoint, method = "POST", status = 201): Response {
  return {
    url: () => url,
    request: () => ({ method: () => method }),
    status: () => status,
  } as unknown as Response;
}

function fakePage(response: Promise<Response>, events: string[] = []): Pick<Page, "waitForResponse"> {
  return {
    waitForResponse: (predicate: (response: Response) => boolean, options: { timeout: number }) => {
      events.push(`wait:${options.timeout}`);
      return response.then((observed) => {
        if (!predicate(observed)) throw new Error("Predicate did not match");
        return observed;
      });
    },
  } as unknown as Pick<Page, "waitForResponse">;
}

test("exact POST matching excludes another method, origin, context, and query", () => {
  assert.equal(matchesExactContextualPost(fakeResponse(), endpoint), true);
  assert.equal(matchesExactContextualPost(fakeResponse(endpoint, "GET"), endpoint), false);
  assert.equal(matchesExactContextualPost(fakeResponse(endpoint.replace("127.0.0.1", "localhost")), endpoint), false);
  assert.equal(matchesExactContextualPost(fakeResponse(endpoint.replace(collectionId, laboratoryId)), endpoint), false);
  assert.equal(matchesExactContextualPost(fakeResponse(`${endpoint}?replay=1`), endpoint), false);
});

test("waiter is installed before submission and rejects nonfinite timeout", async () => {
  const events: string[] = [];
  const response = await submitAndWaitForContextualPost({
    page: fakePage(Promise.resolve(fakeResponse()), events),
    endpoint,
    expectedStatus: 201,
    timeoutMs: 12_000,
    submit: async () => { events.push("submit"); },
  });
  assert.equal(response.status(), 201);
  assert.deepEqual(events, ["wait:12000", "submit"]);
  await assert.rejects(
    submitAndWaitForContextualPost({ page: fakePage(Promise.resolve(fakeResponse())), endpoint, expectedStatus: 201, timeoutMs: Infinity, submit: async () => {} }),
    /finite positive integer/,
  );
});

test("missing browser response is distinct from an HTTP error", async () => {
  const timeout = Object.assign(new Error("wait timed out"), { name: "TimeoutError" });
  let submissions = 0;
  await assert.rejects(
    submitAndWaitForContextualPost({
      page: fakePage(Promise.reject(timeout)), endpoint, expectedStatus: 201, timeoutMs: 200,
      submit: async () => { submissions += 1; },
    }),
    MissingContextualPostResponseError,
  );
  await assert.rejects(
    submitAndWaitForContextualPost({
      page: fakePage(Promise.resolve(fakeResponse(endpoint, "POST", 503))), endpoint, expectedStatus: 201, timeoutMs: 200,
      submit: async () => { submissions += 1; },
    }),
    (error: unknown) => error instanceof UnexpectedContextualPostStatusError && error.status === 503,
  );
  assert.equal(submissions, 2);
});

test("recovery after missing response uses only operation and current GETs", async () => {
  const calls: string[] = [];
  const request = {
    get: async (url: string) => {
      calls.push(`GET ${url}`);
      return { status: () => url.endsWith("/current") ? 200 : 404, json: async () => url.endsWith("/current") ? { diagnosis: null } : { error: { code: "NOT_FOUND" } } };
    },
    post: async () => { throw new Error("Recovery must not POST"); },
  } as unknown as Pick<APIRequestContext, "get">;
  const snapshot = await recoverIhfrAfterMissingResponse(new MissingContextualPostResponseError(`${base}/diagnoses`), request, base, key);
  assert.equal(snapshot.operation.status, 404);
  assert.deepEqual(snapshot.current.body, { diagnosis: null });
  assert.deepEqual(calls, [`GET ${base}/operations/${key}`, `GET ${base}/current`]);
});

test("HTTP errors do not trigger missing-response recovery", async () => {
  let reads = 0;
  const request = { get: async () => { reads += 1; throw new Error("unexpected read"); } } as unknown as Pick<APIRequestContext, "get">;
  const error = new UnexpectedContextualPostStatusError(`${base}/diagnoses`, 500);
  await assert.rejects(recoverIhfrAfterMissingResponse(error, request, base, key), (caught: unknown) => caught === error);
  assert.equal(reads, 0);
});
