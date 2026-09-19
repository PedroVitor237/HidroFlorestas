import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateEnvironmentalPreflight } from "../../scripts/imp-005-migration-preflight";
test("preflight fails closed on absent prerequisite, drift and unsafe counts", () => {
 const good = { prerequisite: true, immutableParent: true, orphanCount: 0, collectionCount: 2, legacyCount: 4 };
 assert.equal(evaluateEnvironmentalPreflight(good).ok, true);
 for (const change of [{ prerequisite:false },{ immutableParent:false },{orphanCount:1},{collectionCount:-1},{legacyCount:NaN}]) assert.throws(()=>evaluateEnvironmentalPreflight({...good,...change}));
});
