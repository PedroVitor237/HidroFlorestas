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
    const operations = Object.values(document.paths).flatMap((path) =>
      Object.entries(path as Record<string, unknown>).filter(([method]) => ["get", "post", "patch", "delete", "put"].includes(method)),
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

  it("matches observed POST/GET statuses, envelopes, examples and DTO fields", async () => {
    const document = YAML.parse(await readFile(contractPath, "utf8"));
    const createPath = "/api/laboratories/{laboratoryId}/areas/{areaId}/collections";
    const detailPath = `${createPath}/{collectionId}`;
    assert.deepEqual(Object.keys(document.paths).sort(), [createPath, detailPath].sort());
    assert.deepEqual(
      Object.keys(document.paths[createPath].post.responses).sort(),
      ["200", "201", "400", "401", "403", "404", "409", "500"],
    );
    assert.deepEqual(
      Object.keys(document.paths[detailPath].get.responses).sort(),
      ["200", "401", "404", "500"],
    );
    assert.deepEqual(
      Object.keys(document.components.schemas.CollectionDetail.properties).sort(),
      ["area", "confirmedAt", "id", "laboratory", "occurredAt", "readOnly"],
    );
    assert.deepEqual(
      Object.keys(document.components.schemas.CollectionResponse.properties),
      ["collection"],
    );
    assert.deepEqual(
      Object.keys(document.components.schemas.ErrorResponse.properties),
      ["error"],
    );
    assert.ok(document.components.examples.CollectionSuccess.value.collection.occurredAt);
    assert.ok(document.components.examples.CollectionSuccess.value.collection.confirmedAt);
  });

  it("keeps handlers and UI limited to POST, GET detail and separately-built navigation", async () => {
    const [postSource, getSource, formSource] = await Promise.all([
      readFile("src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/route.ts", "utf8"),
      readFile("src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/route.ts", "utf8"),
      readFile("src/components/collections/collection-form.tsx", "utf8"),
    ]);
    assert.match(postSource, /export const POST/);
    assert.doesNotMatch(postSource, /export const (GET|PATCH|PUT|DELETE)/);
    assert.match(getSource, /export const GET/);
    assert.doesNotMatch(getSource, /export const (POST|PATCH|PUT|DELETE)/);
    assert.match(formSource, /headers\.get\("Location"\)/);
    assert.match(formSource, /router\.push\(`\/dashboard\/laboratories\/\$\{context\.laboratory\.id\}/);
    assert.doesNotMatch(formSource, /router\.push\([^)]*Location/i);
    const allSources = `${postSource}\n${getSource}`;
    for (const forbidden of ["WaterData", "SoilData", "VegetationData", "TerrainData", "IHFR"])
      assert.equal(allSources.includes(forbidden), false, forbidden);
  });
});
