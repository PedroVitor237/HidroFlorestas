import assert from "node:assert/strict";
import { test } from "node:test";

import { expectImp006Sqlstate } from "../fixtures/expected-sqlstate";

test("expected migration rejection accepts only the required SQLSTATE", async () => {
  await expectImp006Sqlstate("invalid lifecycle reference", "23514", async () => {
    throw Object.assign(new Error("check violation"), { code: "23514" });
  });
});

test("unexpected migration connection error retains its cause", async () => {
  const connectionError = Object.assign(new Error("connection interrupted"), { code: "08006" });
  await assert.rejects(
    () => expectImp006Sqlstate("invalid lifecycle reference", "23514", async () => { throw connectionError; }),
    (error: unknown) => error instanceof Error && error.message.includes("08006") && error.cause === connectionError,
  );
});

test("accepted cross-record inconsistency fails with scenario context", async () => {
  await assert.rejects(
    () => expectImp006Sqlstate("invalid lifecycle reference", "23514", async () => undefined),
    /invalid lifecycle reference: operation unexpectedly succeeded/,
  );
});
