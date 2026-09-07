import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCreateLaboratoryInput, serializePublicLaboratory } from "../../src/app/api/server/laboratories/laboratory.contracts";
import { parseLaboratoriesEnvelope } from "../../src/types/laboratory.type";

describe("laboratory contracts", () => {
  it("accepts only a trimmed name", () => {
    assert.deepEqual(parseCreateLaboratoryInput({ name: "  Mata Viva  " }), { success: true, data: { name: "Mata Viva" } });
    for (const input of [{}, { name: "" }, { name: " ".repeat(3) }, { name: "a".repeat(101) }, { name: "Lab", userId: "other" }, { name: 1 }, null]) {
      assert.equal(parseCreateLaboratoryInput(input).success, false);
    }
  });

  it("serializes the exact public allowlist", () => {
    assert.deepEqual(serializePublicLaboratory({ name: "Lab", createdAt: new Date("2026-09-07T12:00:00Z"), isActive: true }), { name: "Lab", createdAt: "2026-09-07T12:00:00.000Z", status: "ACTIVE" });
  });

  it("rejects envelopes containing internal fields", () => {
    assert.equal(parseLaboratoriesEnvelope({ success: true, laboratory: { name: "Lab", createdAt: "2026-09-07T12:00:00.000Z", status: "ACTIVE", accessCode: "secret" } }), null);
  });
});
