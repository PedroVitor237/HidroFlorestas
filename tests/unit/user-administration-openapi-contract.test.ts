import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";
import { parse } from "yaml";

const document = parse(
  readFileSync("specs/009-user-administration/contracts/admin-users.openapi.yaml", "utf8"),
);

it("declares unique operations, resolvable local references, and controlled failures", () => {
  assert.equal(document.openapi, "3.1.0");
  const operationIds: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      if (key === "$ref") {
        const parts = (value as string).split("/");
        assert.equal(parts.shift(), "#");
        let resolved = document;
        for (const part of parts) resolved = resolved?.[part];
        assert.ok(resolved, `Unresolved ref ${value}`);
      } else walk(value);
    }
  };
  walk(document);
  for (const path of Object.values(document.paths) as Record<string, Record<string, unknown>>[]) {
    for (const rawOperation of Object.values(path)) {
      const operation = rawOperation as {
        operationId: string;
        responses: Record<string, unknown>;
      };
      operationIds.push(operation.operationId);
      assert.ok(operation.responses["500"]);
    }
  }
  assert.equal(operationIds.length, 5);
  assert.equal(new Set(operationIds).size, operationIds.length);
});

it("keeps administrative DTOs closed and excludes sensitive fields", () => {
  for (const name of ["AdminUser", "AuditEvent", "StatusChange", "RoleChange", "Error"]) {
    assert.equal(document.components.schemas[name].additionalProperties, false);
  }
  const properties = document.components.schemas.AdminUser.properties;
  for (const forbidden of ["password", "passwordHash", "isAdmin", "token"]) {
    assert.equal(forbidden in properties, false);
  }
});
