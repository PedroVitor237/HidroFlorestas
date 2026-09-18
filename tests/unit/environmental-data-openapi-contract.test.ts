import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parse } from "yaml";
import { ENVIRONMENTAL_FIELDS } from "../../src/types/environmental-data.validation";
import { MEASUREMENT_CONTRACT_VERSION } from "../../src/types/environmental-data.type";
test("OpenAPI v1 matches the closed field contract and version", () => {
 const api = parse(readFileSync("specs/005-environmental-collection-data/contracts/environmental-data-api.openapi.yaml", "utf8"));
 const schemas = api.components.schemas;
 assert.equal(schemas.PublicEnvironmentalData.properties.measurementContractVersion.const, MEASUREMENT_CONTRACT_VERSION);
 for (const [group, fields] of Object.entries(ENVIRONMENTAL_FIELDS)) {
  const schema = schemas.EnvironmentalInput.properties[group];
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(Object.keys(schema.properties).sort(), Object.keys(fields).sort());
  assert.deepEqual([...schema.required].sort(), Object.keys(fields).filter(k => !fields[k].optional).sort());
  for (const [key, rule] of Object.entries(fields)) {
   const prop = schema.properties[key];
   if (rule.values) assert.deepEqual(prop.enum.filter((v: unknown) => v !== null), [...rule.values]);
   assert.equal(prop.minimum, rule.min); assert.equal(prop.maximum, rule.max);
  }
 }
});
