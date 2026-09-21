import assert from "node:assert/strict";
import { test } from "node:test";
import { canonicalizeIHFRValue, hashCanonicalIHFRValue, loadActiveIHFRManifest, loadHistoricalIHFRManifest } from "../../src/app/api/server/ihfr-diagnosis/manifest-loader";

test("loads only the hash-verified v0.1.1 manifest as active", () => {
  const active = loadActiveIHFRManifest();
  assert.equal(active.mathContractVersion, "ihfr-math-experimental-v0.1.1");
  assert.equal(active.contractHash, "sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89");
  assert.equal(Object.isFrozen(active), true);
});

test("keeps v0.1.0 readable and distinct as historical", () => {
  const historical = loadHistoricalIHFRManifest();
  assert.equal(historical.mathContractVersion, "ihfr-math-experimental-v0.1.0");
  assert.equal(historical.contractHash, "sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b");
  assert.notEqual(historical.contractHash, loadActiveIHFRManifest().contractHash);
});

test("canonicalization recursively sorts objects, preserves arrays and detects any relevant change", () => {
  const first = { z: [{ b: 2, a: 1 }, 3], a: { d: false, c: null } };
  const reordered = { a: { c: null, d: false }, z: [{ a: 1, b: 2 }, 3] };
  assert.equal(canonicalizeIHFRValue(first), canonicalizeIHFRValue(reordered));
  assert.equal(hashCanonicalIHFRValue(first), hashCanonicalIHFRValue(reordered));
  assert.notEqual(hashCanonicalIHFRValue(first), hashCanonicalIHFRValue({ ...reordered, z: [3, { a: 1, b: 2 }] }));
});
