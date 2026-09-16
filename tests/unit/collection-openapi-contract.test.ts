import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import YAML from "yaml";

const contractPath =
  "specs/004-environmental-collection-registration/contracts/collection-registration-api.openapi.yaml";

type NodeValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

function localRefs(value: NodeValue, refs: string[] = []): string[] {
  if (Array.isArray(value)) for (const item of value) localRefs(item as NodeValue, refs);
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (key === "$ref" && typeof child === "string") refs.push(child);
      else localRefs(child as NodeValue, refs);
    }
  }
  return refs;
}

function resolve(document: Record<string, unknown>, ref: string) {
  assert.match(ref, /^#\//);
  return ref
    .slice(2)
    .split("/")
    .reduce<unknown>((value, key) => (value as Record<string, unknown>)[key], document);
}

describe("IMP-004 OpenAPI", () => {
  it("defines exactly create and detail operations with resolvable local refs", async () => {
    const document = YAML.parse(await readFile(contractPath, "utf8"));
    assert.equal(document.openapi, "3.1.0");
    const operations = Object.values(document.paths).flatMap((path: Record<string, unknown>) =>
      Object.entries(path).filter(([method]) => ["get", "post", "patch", "delete", "put"].includes(method)),
    );
    assert.deepEqual(
      operations.map(([, operation]) => (operation as { operationId: string }).operationId).sort(),
      ["createEnvironmentalCollection", "getEnvironmentalCollection"],
    );
    for (const ref of localRefs(document)) assert.ok(resolve(document, ref), ref);
  });

  it("keeps object schemas closed and excludes privileged/scientific fields", async () => {
    const document = YAML.parse(await readFile(contractPath, "utf8"));
    const schemas = document.components.schemas as Record<string, Record<string, unknown>>;
    for (const [name, schema] of Object.entries(schemas)) {
      if (schema.type === "object") assert.equal(schema.additionalProperties, false, name);
    }
    const serialized = JSON.stringify(document);
    for (const forbidden of [
      "userId",
      "confirmationKey",
      "WaterData",
      "SoilData",
      "VegetationData",
      "TerrainData",
      "IHFRDiagnosis",
    ]) assert.equal(serialized.includes(forbidden), false, forbidden);
  });

  it("specifies UUID idempotency, API Location, no-store and closed errors", async () => {
    const document = YAML.parse(await readFile(contractPath, "utf8"));
    const post = document.paths["/api/laboratories/{laboratoryId}/areas/{areaId}/collections"].post;
    assert.equal(post.parameters[2].$ref, "#/components/parameters/IdempotencyKey");
    assert.equal(document.components.parameters.IdempotencyKey.schema.format, "uuid");
    assert.match(document.components.headers.CollectionLocation.example, /^\/api\//);
    assert.equal(document.components.headers.PrivateNoStore.schema.const, "no-store");
    assert.ok(post.responses["400"]);
    assert.ok(post.responses["409"]);
    assert.equal(post.responses.patch, undefined);
    assert.equal(post.responses.delete, undefined);
  });
});
