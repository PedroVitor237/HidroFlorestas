import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createClientUuid } from "../../src/lib/client-uuid";

const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

test("uses the browser native UUID generator when available", () => {
  let nativeCalls = 0;
  const value = createClientUuid({
    randomUUID: () => { nativeCalls += 1; return "00000000-0000-4000-8000-000000000001"; },
    getRandomValues: () => { throw new Error("fallback must not run"); },
  });
  assert.equal(value, "00000000-0000-4000-8000-000000000001");
  assert.equal(nativeCalls, 1);
});

test("getRandomValues fallback sets RFC 4122/9562 version and variant bits", () => {
  const result = createClientUuid({ getRandomValues: (bytes) => { bytes.set(Array.from({ length: 16 }, (_, index) => index)); return bytes; } });
  assert.equal(result, "00010203-0405-4607-8809-0a0b0c0d0e0f");
  assert.match(result, uuidV4);
  assert.equal(Number.parseInt(result[14], 16), 4);
  assert.equal(Number.parseInt(result[19], 16) & 0b1100, 0b1000);
});

test("fails explicitly without cryptographic randomness and has no Math.random fallback", () => {
  assert.throws(() => createClientUuid({}), /SECURE_RANDOM_UNAVAILABLE/);
  const source = readFileSync("src/lib/client-uuid.ts", "utf8");
  assert.equal(source.includes("Math.random"), false);
});
